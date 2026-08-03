import db from './db.js';

export function getAllTasks({ showArchived = false, sortBy = 'due_date', sortOrder = 'ASC' } = {}) {
  const allowedSortFields = ['due_date', 'topic', 'status'];
  const field = allowedSortFields.includes(sortBy) ? sortBy : 'due_date';
  
 
  const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';


  const archiveClause = showArchived ? 'is_archived = 1' : 'is_archived = 0';
  

  const query = `
    SELECT * FROM tasks 
    WHERE ${archiveClause} 
    ORDER BY ${field} ${order}
  `;

  return db.prepare(query).all();
}

export function createTask({ title, description, due_date, topic, status = 'Todo' }) {
  // Double check the status before saving.
  const validStatuses = ['Todo', 'In-Progress', 'Complete'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }

 
  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, due_date, topic, status, is_archived)
    VALUES (?, ?, ?, ?, ?, 0)
  `);

  
  const result = stmt.run(title, description || '', due_date, topic, status);
  
  
  return getTaskById(result.lastInsertRowid); 
}


export function getTaskById(id) {
 
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id); 
}

export function updateTask(id, { title, description, due_date, topic, status }) {
  const validStatuses = ['Todo', 'In-Progress', 'Complete'];
  if (status && !validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }

  const stmt = db.prepare(`
    UPDATE tasks 
    SET title = ?, description = ?, due_date = ?, topic = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  stmt.run(title, description || '', due_date, topic, status, id);
  return getTaskById(id);
}


export function archiveTask(id) {
  
  const stmt = db.prepare(`
    UPDATE tasks 
    SET is_archived = 1, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(id);
  return getTaskById(id);
}