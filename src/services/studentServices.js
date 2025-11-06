const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/students.json');

function readData() {
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, '[]');
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
}

function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

exports.getAll = ({ name, minAge, maxAge, cls, page = 1, limit = 10 }) => {
  let students = readData();

  // filter
  if (name) students = students.filter(s => s.name.toLowerCase().includes(name.toLowerCase()));
  if (cls) students = students.filter(s => s.class === cls);
  if (minAge) students = students.filter(s => s.age >= Number(minAge));
  if (maxAge) students = students.filter(s => s.age <= Number(maxAge));

  // pagination
  const total = students.length;
  const pages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paged = students.slice(offset, offset + Number(limit));

  return { data: paged, meta: { page: Number(page), limit: Number(limit), total, pages } };
};

exports.getById = (id) => {
  const students = readData();
  return students.find(s => s.id === id);
};

exports.create = ({ name, age, class: cls }) => {
  const students = readData();
  const newStudent = { id: uuidv4(), name, age, class: cls || null };
  students.push(newStudent);
  saveData(students);
  return newStudent;
};

exports.update = (id, payload) => {
  const students = readData();
  const idx = students.findIndex(s => s.id === id);
  if (idx === -1) return null;
  students[idx] = { ...students[idx], ...payload };
  saveData(students);
  return students[idx];
};

exports.remove = (id) => {
  const students = readData();
  const idx = students.findIndex(s => s.id === id);
  if (idx === -1) return false;
  students.splice(idx, 1);
  saveData(students);
  return true;
};
