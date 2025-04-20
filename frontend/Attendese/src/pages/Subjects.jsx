import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import { getAuth } from 'firebase/auth';

import Layout from '../components/Layout';

const auth = getAuth();
const api = axios.create({ baseURL: 'http://localhost:4000' });

// Attach token on every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken(false);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh expired tokens and retry once
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const orig = err.config;
    if (err.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      const user = auth.currentUser;
      if (user) {
        try {
          const fresh = await user.getIdToken(true);
          orig.headers.Authorization = `Bearer ${fresh}`;
          return api(orig);
        } catch (e) {
          console.error('Token refresh failed:', e);
        }
      }
    }
    return Promise.reject(err);
  }
);

export default function Subjects() {
  // Form state
  const [subjectName, setSubjectName] = useState('');
  const [attended, setAttended] = useState('');
  const [absent, setAbsent] = useState('');
  const [hourDuration, setHourDuration] = useState('');
  const [note, setNote] = useState('');

  // Data state
  const [subjects, setSubjects] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingAttended, setEditingAttended] = useState('');
  const [editingAbsent, setEditingAbsent] = useState('');
  const [editingNote, setEditingNote] = useState('');
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [toDeleteIndex, setToDeleteIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('nameAsc');

  // Helpers
  const calculateAttendancePercentage = (att, abs, hr) => {
    const total = att + abs;
    if (total === 0) return 0;
    return ((att * hr) / (total * hr) * 100).toFixed(2);
  };

  const calculateTotals = () => {
    let totAtt = 0, totHr = 0;
    subjects.forEach(s => {
      const a = parseFloat(s.attended) || 0;
      const b = parseFloat(s.absent) || 0;
      const h = parseFloat(s.hourDuration) || 1;
      totAtt += a * h;
      totHr += (a + b) * h;
    });
    const perc = totHr === 0 ? 0 : ((totAtt / totHr) * 100).toFixed(2);
    return { totAtt, totHr, perc };
  };

  const getColor = perc => {
    const p = parseFloat(perc);
    if (p < 75) return 'red';
    if (p < 90) return 'yellow';
    return 'green';
  };

  // Fetch
  const fetchSubjects = async () => {
    try {
      const { data } = await api.get('/subjects');
      setSubjects(data);
    } catch (e) {
      console.error('Fetch failed:', e);
    }
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      if (user) fetchSubjects();
      else setSubjects([]);
    });
    return unsub;
  }, []);

  // Handlers
  const handleAdd = async () => {
    if (!subjectName.trim()) return;
    const payload = {
      name: subjectName.trim(),
      attended: parseInt(attended) || 0,
      absent: parseInt(absent) || 0,
      hourDuration: parseFloat(hourDuration) || 1,
      note: note.trim(),
    };
    try {
      await api.post('/subjects', payload);
      await fetchSubjects();
    } catch (e) { console.error('Add error:', e); }
    setSubjectName(''); setAttended(''); setAbsent(''); setHourDuration(''); setNote(''); setIsAdding(false);
  };

  const startEdit = i => {
    const s = subjects[i];
    setEditingIndex(i);
    setEditingAttended(String(s.attended));
    setEditingAbsent(String(s.absent));
    setEditingNote(s.note || '');
  };
  const saveEdit = async () => {
    const orig = subjects[editingIndex];
    const updates = { attended: parseInt(editingAttended)||0, absent: parseInt(editingAbsent)||0, note: editingNote.trim() };
    try {
      const { data: upd } = await api.put(`/subjects/${orig._id}`, updates);
      setSubjects(list => list.map((s,i)=>i===editingIndex?upd:s));
      setEditingIndex(null);
    } catch(e){ console.error('Edit error:',e); }
  };

  const confirmDelete = i => { setToDeleteIndex(i); setIsDeleteVisible(true); };
  const doDelete = async () => {
    const orig = subjects[toDeleteIndex];
    try { await api.delete(`/subjects/${orig._id}`); await fetchSubjects(); }
    catch(e){ console.error('Delete error:',e); }
    setIsDeleteVisible(false);
  };

  // Filter & sort
  const filtered = subjects.filter(s => (s.name||'').toLowerCase().includes(searchQuery.toLowerCase()));
  const sorted = filtered.sort((a,b)=>{
    if(sortOption==='nameAsc') return a.name.localeCompare(b.name);
    if(sortOption==='nameDesc') return b.name.localeCompare(a.name);
    const pa = calculateAttendancePercentage(a.attended,a.absent,a.hourDuration);
    const pb = calculateAttendancePercentage(b.attended,b.absent,b.hourDuration);
    return sortOption==='attendanceAsc' ? pa-pb : pb-pa;
  });

  const { totAtt, totHr, perc } = calculateTotals();

  return (
    <Layout>
      <div className="min-h-screen p-6 bg-gray-100">
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Subjects</h1>
            <div className="flex items-center space-x-4">
              <p className="text-gray-600">Total Attendance: {perc}%</p>
              <button onClick={()=>setIsAdding(!isAdding)} className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
                {isAdding?'Cancel':'Add Subject'}
              </button>
            </div>
          </div>

          {isAdding && (
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              {/* Add form fields */}
              <input type="text" placeholder="Name" value={subjectName} onChange={e=>setSubjectName(e.target.value)} className="w-full p-2 border rounded-lg mb-3" />
              <textarea placeholder="Note" value={note} onChange={e=>setNote(e.target.value)} className="w-full p-2 border rounded-lg mb-3" />
              <div className="grid grid-cols-2 gap-4 mb-3">
                <input type="number" placeholder="Attended" value={attended} onChange={e=>setAttended(e.target.value)} className="p-2 border rounded-lg" />
                <input type="number" placeholder="Absent" value={absent} onChange={e=>setAbsent(e.target.value)} className="p-2 border rounded-lg" />
              </div>
              <input type="number" placeholder="Hours/class" value={hourDuration} onChange={e=>setHourDuration(e.target.value)} className="w-full p-2 border rounded-lg mb-4" />
              <button onClick={handleAdd} className="w-full bg-green-600 text-white px-4 py-2 rounded-xl">Add</button>
            </div>
          )}

          {/* Search & Sort */}
          <div className="mb-6 flex justify-between">
            <input type="text" placeholder="Search..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="p-2 border rounded-lg w-1/2" />
            <select value={sortOption} onChange={e=>setSortOption(e.target.value)} className="p-2 border rounded-lg">
              <option value="nameAsc">Name ↑</option>
              <option value="nameDesc">Name ↓</option>
              <option value="attendanceAsc">Attendance ↑</option>
              <option value="attendanceDesc">Attendance ↓</option>
            </select>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 rounded-2xl shadow-md p-4 border-l-4 border-blue-500 mb-6">
            <p>Total Hours Attended: {totAtt}</p>
            <p>Total Hours Conducted: {totHr}</p>
            <p>Total Attendance %: {perc}%</p>
          </div>

          {/* Subject list */}
          <div className="space-y-4">
            {sorted.length ? sorted.map((s,i)=>(
              <div key={i} className={`bg-white p-4 rounded-2xl shadow-md border-l-4 ${['border-red-500','border-yellow-500','border-green-500'][['red','yellow','green'].indexOf(getColor(calculateAttendancePercentage(s.attended,s.absent,s.hourDuration)))]}`}>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">{s.name}</h2>
                  <div className="flex space-x-2">
                    <button onClick={()=>startEdit(i)} className="text-blue-600">Edit</button>
                    <button onClick={()=>confirmDelete(i)} className="text-red-600">Delete</button>
                  </div>
                </div>
                <p>Attended: {s.attended}</p>
                <p>Absent: {s.absent}</p>
                <p>%: {calculateAttendancePercentage(s.attended,s.absent,s.hourDuration)}%</p>
                {editingIndex===i && (
                  <div className="mt-2 space-y-2">
                    <input type="number" value={editingAttended} onChange={e=>setEditingAttended(e.target.value)} className="w-full p-2 border rounded-lg" />
                    <input type="number" value={editingAbsent} onChange={e=>setEditingAbsent(e.target.value)} className="w-full p-2 border rounded-lg" />
                    <textarea value={editingNote} onChange={e=>setEditingNote(e.target.value)} className="w-full p-2 border rounded-lg" />
                    <button onClick={saveEdit} className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl">Save</button>
                  </div>
                )}
              </div>
            )) : <p className="text-center text-gray-600">No subjects found.</p>}
          </div>
        </div>

        {/* Delete confirmation */}
        {isDeleteVisible && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl">
              <p>Are you sure you want to delete "{subjects[toDeleteIndex]?.name}"?</p>
              <div className="flex justify-end mt-4 space-x-4">
                <button onClick={()=>setIsDeleteVisible(false)} className="px-4 py-2">Cancel</button>
                <button onClick={doDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
