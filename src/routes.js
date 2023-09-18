import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePaths } from './utils/build-route-paths.js';

const database = new Database();

export const routes = [
  {
    method: 'POST',
    path: buildRoutePaths('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      };

      database.insert('tasks', task);

      return res.writeHead(201).end();
    }
  },
  {
    method: 'GET',
    path: buildRoutePaths('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePaths('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title && !description) {
        return res.writeHead(400).end(JSON.stringify({ message: 'title or description are required' }));
      }

      const [task] = database.select('tasks', { id });

      if (!task) {
        return res.writeHead(404).end();
      }

      database.update('tasks', id, {
        title,
        description,
        updated_at: new Date()
      })

      return res.writeHead(204).end();
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePaths('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      const [task] = database.select('tasks', { id });

      if (!task) {
        return res.writeHead(404).end();
      }

      database.delete('tasks', id);

      return res.writeHead(204).end();
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePaths('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;

      const [task] = database.select('tasks', { id })

      if (!task) {
        return res.writeHead(404).end();
      }

      database.update('tasks', id, {
        completed_at: new Date()
      })

      return res.end();
    }
  }
]