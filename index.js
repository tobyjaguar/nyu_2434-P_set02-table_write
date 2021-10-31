const fs = require('fs');
const randPerm = require('random-permutation');
const Chance = require('chance');

let chance = new Chance();
const MAX_DISTRIBUTION = 100;
const MAX_STUDENTS = 50;
const MAX_RECORDS = 50;
const MAX_COURSES = 2;
const SAVE_SIZE = 5;

function gen(frac, num) {
  let p = randPerm(num);
  let outArray = p;
  let pLen = p.length;
  while (pLen > 1) {
    p = p.slice(0,frac*pLen)
    outArray = outArray.concat(p)
    pLen = frac * pLen;
  }
  return outArray;
}

function genStudents(maxStudents) {
  let students = [];
  for (let i = 0; i < maxStudents; i++) {
    students.push(chance.name({ middle: true }))
  }
  return students;
}

function genFracStudents(distArray, nameArray) {
  let fracStudents = [];
  for (let i = 0; i < distArray.length; i++) {
      if (distArray[i] < nameArray.length)
        fracStudents.push(nameArray[distArray[i]]);
    }
  return fracStudents;
}


function genRecords(maxRecords, maxCourses, students, saveSize) {
  // open a file stream for saving to disk
  const stream = fs.createWriteStream('./non-normal-student-reviews.csv', {falgs:'a'});

  let content = '';
  let id = 0;
  let name = '';
  let major = '';
  let department = '';
  let advisor = '';
  let gpa = 0;
  let courseId = 0;
  let courseName = '';
  let review = 0;

  let majors = ['mscs', 'msis'];
  let departments = ['science'];
  let advisors = ['mcphearson', 'george'];
  let courseIds = [101,102,103,201,202,203,301,302,303]
  let courseNames = [
    'cs-intro',
    'math-intro',
    'it-intro',
    'cs-intrm',
    'math-intrm',
    'it-intrm',
    'cs-adv',
    'math-adv',
    'it-adv'
  ]
  let courseSelect = 0;

  for (let i = 1; i <= maxRecords; i++) {
    id = i;
    name = students[i];
    for (let j = 0; j < maxCourses; j++) {
      let courseIdx = chance.integer({min: 0, max: (courseIds.length - 1)});
      courseId = courseIds[courseIdx];
      courseName = courseNames[courseIdx];
      review = chance.floating({min:1, max:5, fixed:2});
      // prepare the record
      content = content.concat(
        '',
        `${id},${name},${courseId},${courseName},${review}\n`
      );
      // write content string and reset it
      if (i % saveSize === 0) {
        stream.write(content);
        content = '';
      }
    } // end course reviews
  } // end Records
  // close file stream
  stream.end();
} // end gen

function genFracRecords(maxRecords, factStudents, saveSize) {
  // open a file stream for saving to disk
  const stream = fs.createWriteStream('./non-normal-frac-student-reviews.csv', {falgs:'a'});

  let content = '';
  let id = 0;
  let name = '';
  let major = '';
  let department = '';
  let advisor = '';
  let gpa = 0;
  let courseId = 0;
  let courseName = '';
  let review = 0;

  let majors = ['mscs', 'msis'];
  let departments = ['science'];
  let advisors = ['mcphearson', 'george'];
  let courseIds = [101,102,103,201,202,203,301,302,303]
  let courseNames = [
    'cs-intro',
    'math-intro',
    'it-intro',
    'cs-intrm',
    'math-intrm',
    'it-intrm',
    'cs-adv',
    'math-adv',
    'it-adv'
  ]
  let courseSelect = 0;

  for (let i = 1; i <= maxRecords; i++) {
    id = i;
    name = factStudents[chance.integer({min:0, max: factStudents.length - 1})];

    let courseIdx = chance.integer({min: 0, max: (courseIds.length - 1)});
    courseId = courseIds[courseIdx];
    courseName = courseNames[courseIdx];
    review = chance.floating({min:1, max:5, fixed:2});
    // prepare the record
    content = content.concat(
      '',
      `${id},${name},${courseId},${courseName},${review}\n`
    );
    // write content string and reset it
    if (i % saveSize === 0) {
      stream.write(content);
      content = '';
    }
  } // end Records
  // close file stream
  stream.end();
} // end gen


// generate the distribution set
let dist = gen(.3,MAX_DISTRIBUTION);
let students = genStudents(MAX_STUDENTS);
// generate a number of uniform records
genRecords(MAX_RECORDS, MAX_COURSES, students, SAVE_SIZE);
// generate a number of fractal records
genFracRecords(MAX_RECORDS, students, SAVE_SIZE);

console.log('task complete.');
