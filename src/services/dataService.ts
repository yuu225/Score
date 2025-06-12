import { ref } from 'vue'

export interface Student {
  id: string
  studentId: string
  name: string
  class: string
  major: string
  createTime: string
}

export interface Course {
  id: string
  courseId: string
  name: string
  credit: number
  teacher: string
  createTime: string
}

export interface Grade {
  id: string
  studentId: string
  studentName: string
  courseId: string
  courseName: string
  score: number
  createTime: string
}

// 学生数据
const students = ref<Student[]>([])

// 课程数据
const courses = ref<Course[]>([])

// 成绩数据
const grades = ref<Grade[]>([])

// 初始化数据
const initData = () => {
  const savedStudents = localStorage.getItem('students')
  if (savedStudents) {
    students.value = JSON.parse(savedStudents)
  }

  const savedCourses = localStorage.getItem('courses')
  if (savedCourses) {
    courses.value = JSON.parse(savedCourses)
  }

  const savedGrades = localStorage.getItem('grades')
  if (savedGrades) {
    grades.value = JSON.parse(savedGrades)
  } else {
    grades.value = []
    localStorage.setItem('grades', JSON.stringify(grades.value))
  }
}

// 添加学生
const addStudent = (student: Student) => {
  students.value.push(student)
  localStorage.setItem('students', JSON.stringify(students.value))
}

// 更新学生
const updateStudent = (student: Student) => {
  const index = students.value.findIndex(s => s.id === student.id)
  if (index !== -1) {
    students.value[index] = student
    localStorage.setItem('students', JSON.stringify(students.value))
  }
}

// 删除学生
const deleteStudent = (id: string) => {
  students.value = students.value.filter(s => s.id !== id)
  localStorage.setItem('students', JSON.stringify(students.value))
}

// 添加课程
const addCourse = (course: Course) => {
  courses.value.push(course)
  localStorage.setItem('courses', JSON.stringify(courses.value))
}

// 更新课程
const updateCourse = (course: Course) => {
  const index = courses.value.findIndex(c => c.id === course.id)
  if (index !== -1) {
    courses.value[index] = course
    localStorage.setItem('courses', JSON.stringify(courses.value))
  }
}

// 删除课程
const deleteCourse = (id: string) => {
  courses.value = courses.value.filter(c => c.id !== id)
  localStorage.setItem('courses', JSON.stringify(courses.value))
}

// 添加成绩
const addGrade = (grade: Grade) => {
  grades.value.push(grade)
  localStorage.setItem('grades', JSON.stringify(grades.value))
}

// 更新成绩
const updateGrade = (grade: Grade) => {
  const index = grades.value.findIndex(g => g.id === grade.id)
  if (index !== -1) {
    grades.value[index] = grade
    localStorage.setItem('grades', JSON.stringify(grades.value))
  }
}

// 删除成绩
const deleteGrade = (id: string) => {
  grades.value = grades.value.filter(g => g.id !== id)
  localStorage.setItem('grades', JSON.stringify(grades.value))
}

export const dataService = {
  students,
  courses,
  grades,
  initData,
  addStudent,
  updateStudent,
  deleteStudent,
  addCourse,
  updateCourse,
  deleteCourse,
  addGrade,
  updateGrade,
  deleteGrade
} 