
const authToken = localStorage.getItem("authToken");

document.addEventListener('DOMContentLoaded', function () {
    const addEventBtn = document.getElementById('add-event');
    const submitEventBtn = document.getElementById('submit-event');
    const closeFormBtn = document.getElementById('close-form');
    const eventForm = document.getElementById('add-event-form');

    const titleInput = document.getElementById('event-title');
    const dateInput = document.getElementById('event-date');
    const descInput = document.getElementById('event-description');
    const locationInput = document.getElementById('event-location');

    const eventsTable = document.getElementById('events-table').getElementsByTagName('tbody')[0];

    let editingEventId = null;

    addEventBtn.addEventListener('click', function () {
        eventForm.style.display = 'block';
        editingEventId = null;
        clearForm();
    });

    closeFormBtn.addEventListener('click', function () {
        eventForm.style.display = 'none';
    });

    function loadEvents() {
        fetch('http://localhost:5000/api/events')
            .then(response => response.json())
            .then(events => {
                eventsTable.innerHTML = '';
                events.forEach(event => {
                    const row = eventsTable.insertRow();
                    row.innerHTML = `
                        <td>${event.title}</td>
                        <td>${event.date}</td>
                        <td>${event.description}</td>
                        <td>${event.location}</td>
                        <td>
                            <button class="edit-btn" data-id="${event._id}">Edit</button>
                            <button class="delete-btn" data-id="${event._id}">Delete</button>
                        </td>
                    `;
                });

                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', function () {
                        deleteEvent(this.dataset.id);
                    });
                });

                document.querySelectorAll('.edit-btn').forEach(btn => {
                    btn.addEventListener('click', function () {
                        editEvent(this.dataset.id);
                    });
                });
            })
            .catch(error => alert('Error fetching events: ' + error.message));
    }

    submitEventBtn.addEventListener('click', function () {
        const title = titleInput.value.trim();
        const date = dateInput.value;
        const description = descInput.value.trim();
        const location = locationInput.value.trim();

        if (!title || !date || !description || !location) {
            alert('All fields are required');
            return;
        }

        if (new Date(date) < new Date()) {
            alert('Event date cannot be in the past.');
            return;
        }

        const eventData = { title, date, description, location };

        if (editingEventId) {
            updateEvent(editingEventId, eventData);
        } else {
            addEvent(eventData);
        }
    });

    function addEvent(eventData) {
        fetch('http://localhost:5000/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData),
        })
        .then(response => response.json())
        .then(() => {
            loadEvents();
            eventForm.style.display = 'none';
        })
        .catch(error => alert("Error adding event: " + error.message));
    }

    function deleteEvent(eventId) {
        fetch(`http://localhost:5000/api/events/${eventId}`, {
            method: 'DELETE',
        })
        .then(() => loadEvents())
        .catch(error => alert("Error deleting event: " + error.message));
    }

    function editEvent(eventId) {
        fetch(`http://localhost:5000/api/events/${eventId}`)
            .then(response => response.json())
            .then(event => {
                titleInput.value = event.title;
                dateInput.value = event.date;
                descInput.value = event.description;
                locationInput.value = event.location;

                eventForm.style.display = 'block';
                editingEventId = eventId;
            })
            .catch(error => alert("Error fetching event: " + error.message));
    }

    function updateEvent(eventId, eventData) {
        fetch(`http://localhost:5000/api/events/${eventId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData),
        })
        .then(response => response.json())
        .then(() => {
            loadEvents();
            eventForm.style.display = 'none';
            editingEventId = null;
        })
        .catch(error => alert("Error updating event: " + error.message));
    }

    function clearForm() {
        titleInput.value = '';
        dateInput.value = '';
        descInput.value = '';
        locationInput.value = '';
    }

    loadEvents();
});

// Marks Management
document.addEventListener('DOMContentLoaded', function () {
    const marksTable = document.getElementById('marks-table').getElementsByTagName('tbody')[0];
    const marksFormContainer = document.getElementById('marks-form-container');
    const marksForm = document.getElementById('marks-form');

    const addMarksBtn = document.getElementById('add-marks-btn');
    const cancelFormBtn = document.getElementById('cancel-form');
    const formTitle = document.getElementById('form-title');
    const studentDropdown = document.getElementById('student-id'); // Assuming this is the ID of the student dropdown

    function loadMarks() {
        fetch("http://localhost:5000/api/marks")
            .then(response => response.json())
            .then(marks => {
                console.log('Marks data:', marks); // Log the marks data for debugging
    
                marksTable.innerHTML = '';  // Clear the table before adding new rows
                marks.forEach(mark => {
                    const studentName = mark.student ? `${mark.student.name} (${mark.student.rollNumber})` : 'Unknown Student';
                    const row = marksTable.insertRow();
                    row.innerHTML = `
                        <td>${studentName}</td>
                        <td>${mark.standard}</td>
                        <td>${mark.examType}</td>
                        <td>${getSubjectMarks(mark.subjects, 'Math')}</td>
                        <td>${getSubjectMarks(mark.subjects, 'Science')}</td>
                        <td>${getSubjectMarks(mark.subjects, 'English')}</td>
                        <td>
                            <button class="edit-btn" data-id="${mark._id}">Edit</button>
                            <button class="delete-btn" data-id="${mark._id}">Delete</button>
                        </td>
                    `;
                });
    
                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', function () {
                        const markId = this.getAttribute('data-id');
                        deleteMark(markId);
                    });
                });
    
                document.querySelectorAll('.edit-btn').forEach(btn => {
                    btn.addEventListener('click', function () {
                        const markId = this.getAttribute('data-id');
                        editMark(markId);
                    });
                });
            })
            .catch(error => console.error('Error fetching marks:', error));
    }

    function getSubjectMarks(subjects, subjectName) {
        const subject = subjects.find(sub => sub.subjectName === subjectName);
        return subject ? subject.marksObtained : "N/A";
    }

    addMarksBtn.addEventListener('click', () => {
        marksForm.reset();
        formTitle.innerText = 'Add Marks';
        marksFormContainer.style.display = 'block';
        loadStudentsDropdown(); // Load students into the dropdown when the form is displayed
    });

    cancelFormBtn.addEventListener('click', () => {
        marksFormContainer.style.display = 'none';
    });

    marksForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const markId = document.getElementById("mark-id").value;
        const studentId = document.getElementById("student-id").value;
        const standard = document.getElementById("class-name").value;
        const examType = document.getElementById("exam-type").value;

        const subjects = [
            { subjectName: "Math", marksObtained: parseInt(document.getElementById("math-marks").value), totalMarks: 100 },
            { subjectName: "Science", marksObtained: parseInt(document.getElementById("science-marks").value), totalMarks: 100 },
            { subjectName: "English", marksObtained: parseInt(document.getElementById("english-marks").value), totalMarks: 100 }
        ];

        const marksData = { studentId, standard, subjects, examType };

        const method = markId ? 'PATCH' : 'POST';
        const url = markId ? `http://localhost:5000/api/marks/${markId}` : 'http://localhost:5000/api/marks';

        fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(marksData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => { throw new Error(error.message) });
            }
            return response.json();
        })
        .then(() => {
            loadMarks();  // Refresh the table after submit
            marksFormContainer.style.display = "none";
        })
        .catch(error => {
            alert(`Error: ${error.message}`);
            console.error("Error saving marks:", error);
        });
    });

    function editMarks(id) {
        fetch(`http://localhost:5000/api/marks/${id}`)
            .then(response => response.json())
            .then(mark => {
                document.getElementById("mark-id").value = mark._id;
                document.getElementById("student-id").value = mark.studentId?._id || "";  // Fix if studentId is missing or incomplete
                document.getElementById("class-name").value = mark.standard;
                document.getElementById("exam-type").value = mark.examType;

                mark.subjects.forEach(subject => {
                    document.getElementById(`${subject.subjectName.toLowerCase()}-marks`).value = subject.marksObtained;
                });

                formTitle.innerText = "Edit Marks";
                marksFormContainer.style.display = "block";
                loadStudentsDropdown(); // Load students into the dropdown when the form is displayed
            })
            .catch(error => console.error("Error fetching mark details:", error));
    }

    function deleteMarks(id) {
        if (confirm('Are you sure you want to delete this record?')) {
            fetch(`http://localhost:5000/api/marks/${id}`, { method: 'DELETE' })
                .then(() => loadMarks())
                .catch(error => console.error('Error deleting marks:', error));
        }
    }

    function loadStudentsDropdown() {
        fetch("http://localhost:5000/api/students")
            .then(response => response.json())
            .then(students => {
                studentDropdown.innerHTML = ''; // Clear the dropdown before adding new options
                students.forEach(student => {
                    const option = document.createElement('option');
                    option.value = student._id;
                    option.textContent = `${student.name} (${student.rollNumber})`;
                    studentDropdown.appendChild(option);
                });
            })
            .catch(error => console.error("Error fetching students:", error));
    }

    loadMarks();  // Marks table first for initial load
});

// Homework Management
document.addEventListener('DOMContentLoaded', function () {
    const addHomeworkBtn = document.getElementById('add-homework');
    const closeHomeworkFormBtn = document.getElementById('close-homework-form');
    const homeworkTable = document.getElementById('homework-table').getElementsByTagName('tbody')[0];
    const homeworkForm = document.getElementById('homework-form');
    const submitHomeworkBtn = document.getElementById('submit-homework');
    const standardInput = document.getElementById("homework-standard");
    const subjectInput = document.getElementById("homework-subject");
    const titleInput = document.getElementById('homework-title');
    const dueDateInput = document.getElementById('homework-dueDate');
    const descriptionInput = document.getElementById('homework-description');
    const formTitle = document.getElementById('form-title');

    let editingHomeworkId = null;

    addHomeworkBtn.addEventListener('click', function () {
        homeworkForm.style.display = 'block';
        formTitle.textContent = 'New Homework';
        submitHomeworkBtn.textContent = 'Submit';
        editingHomeworkId = null;
        clearForm();
    });

    closeHomeworkFormBtn.addEventListener('click', function () {
        homeworkForm.style.display = 'none';
    });

    function loadHomework() {
        fetch('http://localhost:5000/api/homework')
            .then(response => response.json())
            .then(homeworks => {
                homeworkTable.innerHTML = '';
                homeworks.forEach(homework => {
                    const row = homeworkTable.insertRow();
                    row.innerHTML = `
                        <td>${homework.title}</td>
                        <td>${homework.dueDate}</td>
                        <td>${homework.description}</td>
                        <td>
                            <button class="edit-btn" data-id="${homework._id}">Edit</button>
                            <button class="delete-btn" data-id="${homework._id}">Delete</button>
                        </td>
                    `;
                });

                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', function () {
                        deleteHomework(this.dataset.id);
                    });
                });

                document.querySelectorAll('.edit-btn').forEach(btn => {
                    btn.addEventListener('click', function () {
                        editHomework(this.dataset.id);
                    });
                });
            })
            .catch(error => console.error('Error fetching homework:', error));
    }

    submitHomeworkBtn.addEventListener("click", function () {
        const standard = standardInput.value;
        const subject = subjectInput.value.trim();
        const dueDate = dueDateInput.value;
        const description = descriptionInput.value.trim();

        if (!standard || !subject || !dueDate || !description) {
            alert("All fields are required");
            return;
        }

        const homeworkData = {
            title: titleInput.value.trim(),
            standard: standardInput.value,
            subject: subjectInput.value.trim(),
            description: descriptionInput.value.trim(),
            dueDate: dueDateInput.value
        };

        if (editingHomeworkId) {
            updateHomework(editingHomeworkId, homeworkData);
        } else {
            addHomework(homeworkData);
        }
    });

    function addHomework(homeworkData) {
        fetch('http://localhost:5000/api/homework', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(homeworkData),
        })
        .then(response => response.json())
        .then(() => {
            loadHomework();
            homeworkForm.style.display = 'none';
        })
        .catch(error => console.error('Error adding homework:', error));
    }

    function deleteHomework(homeworkId) {
        fetch(`http://localhost:5000/api/homework/${homeworkId}`, {
            method: 'DELETE',
        })
        .then(() => loadHomework())
        .catch(error => console.error('Error deleting homework:', error));
    }

    function editHomework(homeworkId) {
        console.log(`Fetching homework with ID: ${homeworkId}`); // Log the homeworkId for debugging
    
        fetch(`http://localhost:5000/api/homework/${homeworkId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text(); // Read the response as text
            })
            .then(responseText => {
                try {
                    const homework = JSON.parse(responseText); // Try to parse the response as JSON
                    titleInput.value = homework.title;
                    dueDateInput.value = homework.dueDate;
                    descriptionInput.value = homework.description;
                    standardInput.value = homework.standard;
                    subjectInput.value = homework.subject;
    
                    homeworkForm.style.display = 'block';
                    formTitle.textContent = 'Edit Homework';
                    submitHomeworkBtn.textContent = 'Update';
    
                    editingHomeworkId = homeworkId;
                } catch (error) {
                    console.error('Error parsing JSON:', error, responseText); // Log the response text for debugging
                }
            })
            .catch(error => console.error('Error fetching homework:', error));
    }


    function updateHomework(homeworkId, homeworkData) {
        fetch(`http://localhost:5000/api/homework/${homeworkId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(homeworkData),
        })
        .then(response => response.json())
        .then(() => {
            loadHomework();
            homeworkForm.style.display = 'none';
            editingHomeworkId = null;
            submitHomeworkBtn.textContent = 'Submit';
        })
        .catch(error => console.error('Error updating homework:', error));
    }

    function clearForm() {
        titleInput.value = '';
        dueDateInput.value = '';
        descriptionInput.value = '';
    }

    loadHomework();
});

// Students Management
document.addEventListener("DOMContentLoaded", function () {
    const studentsTable = document.getElementById("students-table").getElementsByTagName("tbody")[0];
    const modal = document.getElementById("student-modal");
    const closeModalBtn = document.querySelector('#student-modal .close');
    const studentModal = document.getElementById('student-modal');
    const addStudentBtn = document.getElementById("add-student-btn");
    const studentForm = document.getElementById("student-form");
    const modalTitle = document.getElementById("modal-title");

    const studentIdInput = document.getElementById("student-id");
    const studentNameInput = document.getElementById("student-name");
    const studentStandardInput = document.getElementById("student-standard");
    const studentRollNumberInput = document.getElementById("student-roll-number");
    const parentNameInput = document.getElementById("parent-name");
    const studentEmailInput = document.getElementById("student-email");

    function loadStudents() {
        fetch("http://localhost:5000/api/students")
            .then(response => response.json())
            .then(students => {
                studentsTable.innerHTML = "";
                students.forEach(student => {
                    const row = studentsTable.insertRow();
                    row.innerHTML = `
                        <td>${student.name}</td>
                        <td>${student.standard}</td>
                        <td>${student.rollNumber}</td>
                        <td>${student.parentName}</td>
                        <td>${student.parentEmail}</td>
                        <td>
                            <button onclick="editStudent('${student._id}', '${student.name}', '${student.standard}', '${student.rollNumber}', '${student.parentName}', '${student.parentEmail}')">Edit</button>
                            <button onclick="deleteStudent('${student._id}')">Delete</button>
                        </td>
                    `;
                });
            })
            .catch(error => console.error("Error fetching students:", error));
    }

    function addOrUpdateStudent(event) {
        event.preventDefault();

        if (!validateForm()) return;

        const studentData = {
            name: studentNameInput.value,
            standard: studentStandardInput.value,
            rollNumber: studentRollNumberInput.value,
            parentEmail: studentEmailInput.value,
            parentName: parentNameInput.value
        };

        const method = studentIdInput.value ? "PUT" : "POST";
        const url = studentIdInput.value ? `http://localhost:5000/api/students/${studentIdInput.value}` : "http://localhost:5000/api/students";

        fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message && data.message.includes("Roll number already exists")) {
                alert("This roll number already exists. Please use a different roll number.");
                return;
            }
            loadStudents();
            modal.style.display = "none";
        })
        .catch(error => {
            console.error("Error saving student:", error);
            alert("There was an error. Please try again later.");
        });
    }

    function validateForm() {
        if (!studentNameInput.value.trim() || 
            !studentStandardInput.value.trim() || 
            !studentRollNumberInput.value.trim() || 
            !parentNameInput.value.trim() || 
            !studentEmailInput.value.trim()) {
            alert("All fields are required.");
            return false;
        }

        if (isNaN(studentRollNumberInput.value)) {
            alert("Roll Number must be a number.");
            return false;
        }

        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!emailPattern.test(studentEmailInput.value)) {
            alert("Enter a valid email address.");
            return false;
        }

        return true;
    }

    function editStudent(id, name, standard, rollNumber, parentName, email) {
        studentForm.reset();
        studentIdInput.value = id;
        studentNameInput.value = name;
        studentStandardInput.value = standard;
        studentRollNumberInput.value = rollNumber;
        parentNameInput.value = parentName;
        studentEmailInput.value = email;
        modalTitle.textContent = "Edit Student";
        modal.style.display = "block";
    }

    function deleteStudent(id) {
        if (confirm("Are you sure you want to delete this student?")) {
            fetch(`http://localhost:5000/api/students/${id}`, { method: "DELETE" })
                .then(() => loadStudents())
                .catch(error => console.error("Error deleting student:", error));
        }
    }

    // Show the modal when the add student button is clicked
    addStudentBtn.addEventListener('click', function () {
        studentModal.style.display = 'block';
    });

   // Hide the modal when the close button is clicked
   closeModalBtn.addEventListener('click', function () {
    studentModal.style.display = 'none';
});
 // Hide the modal when clicking outside of the modal content
 window.addEventListener('click', function (event) {
    if (event.target === studentModal) {
        studentModal.style.display = 'none';
    }
});


    studentForm.addEventListener("submit", function(event) {
        addOrUpdateStudent(event);
    });

    loadStudents();
});