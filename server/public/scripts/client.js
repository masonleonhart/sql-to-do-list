$(() => {
    console.log('JQ and JS');
    getTasks();
    clickListeners();
});

function clickListeners() {
    $('table').on('click', '.delete', popupDelete);
    $('table').on('click', '.toggle', toggleComplete);
    $('#add-task').on('click', addTaskPopup);
    $('table').on('click', '.priority-radio', changePriority);
};

function addTaskPopup() {
    // Pops open a sweet alert to add a task
    Swal.fire({
        title: 'Add Task',
        html: `
        <label for="task-name" class="add-labels">Task Name</label>
        <input type="text" id="task-name" class="swal2-input" placeholder="Task Name">
        <label for="task-description" class="add-labels">Task Description</label>
        <textarea class="swal2-input" id="task-description" placeholder="Task Description"></textarea>`,
        confirmButtonText: 'Add task',
        confirmButtonColor: '#28a745',
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
    }).then(result => {
        if (result.isConfirmed) {
            addTask(result.value);
            Swal.fire("Task added!", "Your task has been added.", "success");
        } else {
            Swal.fire("Canceled!", "Your task has not been added.", "error");
            return;
        };
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
    $('#completedTasks').empty();
    console.log('Appending data', tasks);

    for (const task of tasks) {
        if (task.status === 'In progress') {
            $('#viewTasks').append(`
            <tr data-taskid="${task.id}">
                <td class="priority">
                    <p class="priority-indicator"><span>1</span><span>2</span><span>3</span></p>
                    <label class="radio-buttons">
                        <input type="radio" name="priority${task.id}" class="priority-radio" id="${task.id}priorityLow" data-priority="1">
                        <input type="radio" name="priority${task.id}" class="priority-radio" id="${task.id}priorityMed" data-priority="2">
                        <input type="radio" name="priority${task.id}" class="priority-radio" id="${task.id}priorityHigh" data-priority="3">
                    </label>
                </td>
                <td>${task.name}</td>
                <td class="description">${task.description}</td>
                <td class="status">${task.status}</td>
                <td class="btn-group controls"><Button class="toggle btn btn-success">Complete</button><button class="delete btn btn-danger">Delete</button></td>
            </tr>
        `);
        } else {
            $('#completedTasks').append(`
            <tr data-taskid="${task.id}">
                <td class="priority">
                    <p class="priority-indicator"><span>1</span><span>2</span><span>3</span></p>
                    <label class="radio-buttons">
                        <input type="radio" name="priority${task.id}" class="priority-radio" id="${task.id}priorityLow" data-priority="1">
                        <input type="radio" name="priority${task.id}" class="priority-radio" id="${task.id}priorityMed" data-priority="2">
                        <input type="radio" name="priority${task.id}" class="priority-radio" id="${task.id}priorityHigh" data-priority="3">
                    </label>
                </td>
                <td>${task.name}</td>
                <td class="description">${task.description}</td>
                <td>${task.timeComplete}</td>
                <td class="status">${task.status}</td>
                <td class="btn-group controls"><Button class="toggle btn btn-success">In progress</button><button class="delete btn btn-danger">Delete</button></td>
            </tr>
            `);
        };

        // Applies the checked attribute to relative priority button
        switch (task.priority) {
            case 1:
                $(`#${task.id}priorityLow`).attr(`checked`, true);
                break;
            case 2:
                $(`#${task.id}priorityMed`).attr(`checked`, true);
                break;
            case 3:
                $(`#${task.id}priorityHigh`).attr(`checked`, true);
                break;
        };
    };
};

function toggleComplete(event) {
    // Looks at status from DOM and changes to Complete or In progress
    const taskStatus = $(event.target).parent().parent().find('.status').text();
    const taskId = $(event.target).closest('tr').data('taskid');
    let timeComplete;
    let newTaskStatus;

    switch (taskStatus) {
        case 'In progress':
            newTaskStatus = 'Complete';
            timeComplete = moment().format('MM-DD-YYYY HH:mm');
            break;
        case 'Complete':
            newTaskStatus = 'In progress';
            timeComplete = null;
            break;
    };

    console.log(`Updating task at id: ${taskId} from status: ${taskStatus} to status:`, newTaskStatus);

    $.ajax({
        method: 'PUT',
        url: `/list/status/${taskId}`,
        data: {
            statusChange: newTaskStatus,
            timeComplete
        }
    }).then(response => {
        console.log(`Updated task status at id: ${taskId} successfully`);
        getTasks();
    }).catch(error => {
        console.log('Error in updating data', error.statusText);
    });
};

function changePriority(event) {
    // Listens for radio button click and changes priority
    const taskPriority = $(event.target).data('priority');
    const taskId = $(event.target).closest('tr').data('taskid');
    console.log(`Updating task at id: ${taskId} to priority ${taskPriority}`);

    $.ajax({
        method: 'PUT',
        url: `list/priority/${taskId}`,
        data: {
            priorityChange: taskPriority
        }
    }).then(response => {
        console.log(`Updated task priority at id: ${taskId} successfully`);
        getTasks();
    }).catch(error => {
        console.log('Error in updating data', error.statusText);
    });
};

function popupDelete (event) {
    // A popup to confirm or cancel delete
    const taskId = $(event.target).closest('tr').data('taskid')
    Swal.fire({
        title: 'Delete',
        text: 'Are you sure you want to delete this task?',
        icon: 'warning',
        confirmButtonText: 'Delete task',
        confirmButtonColor: '#dc3545',
        focusConfirm: false,
        showCancelButton: true,
    }).then(result => {
        if (result.isConfirmed) {
            deleteTask(taskId);
            Swal.fire("Deleted!", "Your task has been deleted.", "success");
        } else {
            Swal.fire("Canceled!", "Your task has not been deleted.", "error");
            return;
        };
    });
};

function deleteTask(taskId) {
    // Deletes task based on taskId grabbed from closest tr
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