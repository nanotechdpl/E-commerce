const { Pool } = require('pg');

const pgPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'file_db',
  user: process.env.DB_USER || 'file_user',
  password: process.env.DB_PASS || 'file_pass',
});

const connectDB = async () => {
  try {
    await pgPool.connect();
    console.log('PostgreSQL connected for File service');

    // Create tables
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS files (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        mimetype VARCHAR(100) NOT NULL,
        size BIGINT NOT NULL,
        gcs_bucket VARCHAR(100) NOT NULL,
        gcs_key VARCHAR(500) NOT NULL,
        gcs_url TEXT,
        upload_type VARCHAR(50) DEFAULT 'general',
        uploaded_by INTEGER,
        metadata JSONB DEFAULT '{}',
        is_public BOOLEAN DEFAULT false,
        is_deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pgPool.query(`
        CREATE INDEX IF NOT EXISTS idx_files_upload_user_id ON files(upload_user_id);
    `);

    // await pgPool.query(`
    //   CREATE INDEX IF NOT EXISTS idx_files_uploaded_by ON files(uploaded_by);
    // `);

    await pgPool.query(`
      CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at);
    `);

    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS file_access_logs (
        id SERIAL PRIMARY KEY,
        file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
        user_id INTEGER,
        action VARCHAR(50) NOT NULL,
        ip_address INET,
        user_agent TEXT,
        accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

  } catch (err) {
    console.error('PostgreSQL connection error:', err);
  }
};

module.exports = { pgPool, connectDB };