const { pgPool } = require('../config/database');

class File {
    static async create(fileData) {
        const query = `
      INSERT INTO files (filename, original_name, mimetype, size, gcs_bucket, gcs_key, gcs_url, upload_type, uploaded_by, metadata, is_public)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

        const values = [
            fileData.filename,
            fileData.original_name,
            fileData.mimetype,
            fileData.size,
            fileData.gcs_bucket,
            fileData.gcs_key,
            fileData.gcs_url,
            fileData.upload_type || 'general',
            fileData.uploaded_by,
            JSON.stringify(fileData.metadata || {}),
            fileData.is_public || false
        ];

        const result = await pgPool.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM files WHERE id = $1 AND is_deleted = false';
        const result = await pgPool.query(query, [id]);
        return result.rows[0];
    }

    static async findByUploadedBy(uploaded_by, limit = 20, offset = 0) {
        const query = `
      SELECT * FROM files 
      WHERE uploaded_by = $1 AND is_deleted = false
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;

        const result = await pgPool.query(query, [uploaded_by, limit, offset]);
        return result.rows;
    }

    static async findByType(upload_type, limit = 20, offset = 0) {
        const query = `
      SELECT * FROM files 
      WHERE upload_type = $1 AND is_deleted = false
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;

        const result = await pgPool.query(query, [upload_type, limit, offset]);
        return result.rows;
    }

    static async getAll(limit = 20, offset = 0) {
        const query = `
      SELECT * FROM files 
      WHERE is_deleted = false
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;

        const result = await pgPool.query(query, [limit, offset]);
        return result.rows;
    }

    static async search(searchTerm, limit = 20, offset = 0) {
        const query = `
      SELECT * FROM files 
      WHERE (original_name ILIKE $1 OR filename ILIKE $1) AND is_deleted = false
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;

        const result = await pgPool.query(query, [`%${searchTerm}%`, limit, offset]);
        return result.rows;
    }

    static async updateMetadata(id, metadata) {
        const query = `
      UPDATE files 
      SET metadata = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 AND is_deleted = false
      RETURNING *
    `;

        const result = await pgPool.query(query, [JSON.stringify(metadata), id]);
        return result.rows[0];
    }

    static async softDelete(id) {
        const query = `
      UPDATE files 
      SET is_deleted = true, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;

        const result = await pgPool.query(query, [id]);
        return result.rows[0];
    }

    static async getStats(uploaded_by = null) {
        let query, values;

        if (uploaded_by) {
            query = `
        SELECT 
          COUNT(*) as total_files,
          SUM(size) as total_size,
          COUNT(CASE WHEN mimetype LIKE 'image/%' THEN 1 END) as image_count,
          COUNT(CASE WHEN mimetype LIKE 'video/%' THEN 1 END) as video_count,
          COUNT(CASE WHEN mimetype LIKE 'audio/%' THEN 1 END) as audio_count,
          COUNT(CASE WHEN mimetype = 'application/pdf' THEN 1 END) as pdf_count
        FROM files 
        WHERE uploaded_by = $1 AND is_deleted = false
      `;
            values = [uploaded_by];
        } else {
            query = `
        SELECT 
          COUNT(*) as total_files,
          SUM(size) as total_size,
          COUNT(CASE WHEN mimetype LIKE 'image/%' THEN 1 END) as image_count,
          COUNT(CASE WHEN mimetype LIKE 'video/%' THEN 1 END) as video_count,
          COUNT(CASE WHEN mimetype LIKE 'audio/%' THEN 1 END) as audio_count,
          COUNT(CASE WHEN mimetype = 'application/pdf' THEN 1 END) as pdf_count
        FROM files 
        WHERE is_deleted = false
      `;
            values = [];
        }

        const result = await pgPool.query(query, values);
        return result.rows[0];
    }

    static async logAccess(file_id, user_id, action, ip_address, user_agent) {
        const query = `
      INSERT INTO file_access_logs (file_id, user_id, action, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

        const result = await pgPool.query(query, [file_id, user_id, action, ip_address, user_agent]);
        return result.rows[0];
    }
}

module.exports = File;