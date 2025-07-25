-- USERS (Admin & Öğretmen Giriş)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'teacher')) NOT NULL
);

-- TEACHERS
CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- STUDENTS
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    is_new BOOLEAN DEFAULT TRUE
);

-- COURSES
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    course_no VARCHAR(20) UNIQUE NOT NULL,
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
    total_sessions INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active'
);

-- COURSE-STUDENT İLİŞKİSİ (Ödeme durumu dahil)
CREATE TABLE IF NOT EXISTS course_students (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    has_paid BOOLEAN DEFAULT FALSE
);

-- OTURUMLAR (Dersler)
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    session_number INTEGER NOT NULL,
    date DATE,
    topic TEXT,
    notes TEXT,
    status VARCHAR(20) CHECK (status IN ('completed', 'cancelled')) DEFAULT 'completed'
);

-- ÖĞRETMEN ÖDEMELERİ
CREATE TABLE IF NOT EXISTS teacher_payments (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    is_paid BOOLEAN DEFAULT FALSE
);

-- OTURUM-ÖĞRENCİ İLİŞKİSİ (Katılım durumu dahil)
CREATE TABLE IF NOT EXISTS session_students (
  session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  attended BOOLEAN DEFAULT true,
  PRIMARY KEY (session_id, student_id)
);


-- Ekleme

ALTER TABLE users
ADD COLUMN "created_at" TIMESTAMP DEFAULT NOW(),
ADD COLUMN "updated_at" TIMESTAMP DEFAULT NOW();
ALTER TABLE teachers
ADD COLUMN "created_at" TIMESTAMP DEFAULT NOW(),
ADD COLUMN "updated_at" TIMESTAMP DEFAULT NOW();
ALTER TABLE students
ADD COLUMN "created_at" TIMESTAMP DEFAULT NOW(),
ADD COLUMN "updated_at" TIMESTAMP DEFAULT NOW();
ALTER TABLE courses
ADD COLUMN "created_at" TIMESTAMP DEFAULT NOW(),
ADD COLUMN "updated_at" TIMESTAMP DEFAULT NOW();
ALTER TABLE course_students
ADD COLUMN "created_at" TIMESTAMP DEFAULT NOW(),
ADD COLUMN "updated_at" TIMESTAMP DEFAULT NOW();
ALTER TABLE sessions
ADD COLUMN "created_at" TIMESTAMP DEFAULT NOW(),
ADD COLUMN "updated_at" TIMESTAMP DEFAULT NOW();
ALTER TABLE teacher_payments
ADD COLUMN "created_at" TIMESTAMP DEFAULT NOW(),
ADD COLUMN "updated_at" TIMESTAMP DEFAULT NOW();
ALTER TABLE session_students
ADD COLUMN "created_at" TIMESTAMP DEFAULT NOW(),
ADD COLUMN "updated_at" TIMESTAMP DEFAULT NOW();
