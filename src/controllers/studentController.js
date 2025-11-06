const studentService = require('../services/studentServices.js');

exports.getAll = (req, res, next) => {
  try {
    const { name, minAge, maxAge, class: cls, page, limit } = req.query;
    const result = studentService.getAll({ name, minAge, maxAge, cls, page, limit });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getById = (req, res, next) => {
  try {
    const student = studentService.getById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    next(err);
  }
};

exports.create = (req, res, next) => {
  try {
    const { name, age, class: cls } = req.body;
    if (!name || !age) return res.status(400).json({ error: 'Name and age are required' });
    const student = studentService.create({ name, age, class: cls });
    res.status(201).json(student);
  } catch (err) {
    next(err);
  }
};

exports.update = (req, res, next) => {
  try {
    const updated = studentService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Student not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.remove = (req, res, next) => {
  try {
    const ok = studentService.remove(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Student not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
