$(() => {
    console.log('JQ and JS');
    getTasks();
    clickListeners();
});

function clickListeners() {
    $('#viewTasks').on('click', '.delete', popupDelete);
    $('#viewTasks').on('click', '.toggle', toggleComplete);
    $('#add-task').on('click', addTaskPopup);
    $('#viewTasks').on('click', '.priority-radio', changePriority);
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
    console.log('Appending data', tasks);

    for (const task of tasks) {
        $('#viewTasks').append(`
            <tr data-taskid="${task.id}">
                <td>
                    <p id="priority-indicator"><span>1</span><span>2</span><span>3</span></p>
                    <label id="radio-buttons">
                        <input type="radio" name="priority${task.id}" class="priority-radio" id="${task.id}priorityLow" data-priority="1">
                        <input type="radio" name="priority${task.id}" class="priority-radio" id="${task.id}priorityMed" data-priority="2">
                        <input type="radio" name="priority${task.id}" class="priority-radio" id="${task.id}priorityHigh" data-priority="3">
                    </label>
                </td>
                <td>${task.name}</td>
                <td>${task.description}</td>
                <td class="status">${task.status}</td>
                <td><Button class="toggle">Toggle Status</button><button class="delete">Delete</button></td>
            </tr>
        `);

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
    let newTaskStatus;

    switch (taskStatus) {
        case 'In progress':
            newTaskStatus = 'Complete';
            break;
        case 'Complete':
            newTaskStatus = 'In progress';
            break;
    };

    console.log(`Updating task at id: ${taskId} from status: ${taskStatus} to status:`, newTaskStatus);

    $.ajax({
        method: 'PUT',
        url: `/list/status/${taskId}`,
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
        focusConfirm: false,
        showCancelButton: true,
        closeOnConfirm: false,
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