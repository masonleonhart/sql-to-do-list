$(() => {
    console.log('JQ and JS');
    getTasks();
    clickListeners();
});

function clickListeners() {
    $('#submit-button').on('click', addTask);
    $('tbody').on('click', '.delete', deleteTask);
    $('tbody').on('click', '.toggle', toggleComplete);
    $('#add-task').on('click', addTaskPopup);
};

function addTaskPopup() {
    // Pops open a sweet alert to add a task
    Swal.fire({
        title: 'Add Task',
        html: `<input type="text" id="task-name" class="swal2-input" placeholder="Task Name">
        <textarea class="swal2-input" id="task-description" placeholder="Task Description"></textarea>`,
        confirmButtonText: 'Add task',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            const name = Swal.getPopup().querySelector('#task-name').value
            const description = Swal.getPopup().querySelector('#task-description').value
            if (!name || !description) {
                Swal.showValidationMessage(`Please enter a task name and a task description`)
            };
            return { name: name, description: description }
        }
    }).then((result) => {
        addTask(result.value);
    });
};

function addTask(task) {
    // Adds a task and calls function to get all data so the table can refresh
    let newTask = task;
    console.log('Adding task to list', newTask);

    $.ajax({
        method: 'POST',
        url: '/list',
        data: newTask
    }).then(response => {
        console.log(`Added task successfully`, newTask);
        getTasks();
    }).catch(error => {
        console.log('Error in adding task', error.statusText);
    });
};

function getTasks() {
    // Gets all data from DB and calls function to append data to dom
    console.log(`Retrieving data from DB`);

    $.ajax({
        method: 'GET',
        url: '/list'
    }).then(response => {
        console.log('Retrieved data successfully');
        appendData(response);
    }).catch(error => {
        console.log('Error in retrieving data', error.statusText);
    });
};

function appendData(tasks) {
    // Appends all data that is passed through from getTasks to the DOM
    $('#viewTasks').empty();
    console.log('Appending data', tasks);

    for (const task of tasks) {
        $('#viewTasks').append(`
            <tr data-taskid="${task.id}">
                <td>${task.name}</td>
                <td>${task.description}</td>
                <td class="status">${task.status}</td>
                <td><Button class="toggle">Toggle Status</button><button class="delete">Delete</button></td>
            </tr>
        `);
    };
};

function toggleComplete(event) {
    // Looks at status from DOM and changes to Complete or In progress
    const taskStatus = $(event.target).parent().parent().find('.status').text();
    const taskId = $(event.target).closest('tr').data('taskid');
    let newTaskStatus;

    if (taskStatus === 'In progress') {
        newTaskStatus = 'Complete'
    } else if (taskStatus === 'Complete') {
        newTaskStatus = 'In progress'
    };

    console.log(`Updating task at id: ${taskId} from status: ${taskStatus} to status:`, newTaskStatus);

    $.ajax({
        method: 'PUT',
        url: `/list/${taskId}`,
        data: {
            statusChange: newTaskStatus
        }
    }).then(response => {
        console.log(`Updated task status at id: ${taskId} successfully`);
        getTasks();
    }).catch(error => {
        console.log('Error in updating data', error.statusText);
    });
};

function deleteTask(event) {
    // Deletes task based on taskId grabbed from closest tr
    const taskId = $(event.target).closest('tr').data('taskid')
    console.log('Deleting task at id:', taskId);

    $.ajax({
        method: 'DELETE',
        url: `/list/${taskId}`
    }).then(response => {
        console.log(`Deleted task at id: ${taskId} successfully`);
        getTasks();
    }).catch(error => {
        console.log('Error in deleting data', error.statusText);
    });
};