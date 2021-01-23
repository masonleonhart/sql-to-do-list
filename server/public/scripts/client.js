$(() => {
    console.log('JQ and JS');
    getTasks();
    clickListeners();
});

function clickListeners() {
    $('#submit-button').on('click', addTask);
};

function addTask() {
    // Adds a task and calls function to get all data so the table can refresh
    let newTask = {
        name: $('#task-name').val(),
        description: $('#task-description').val()
    }
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
                <td>${task.status}</td>
                <td><Button>Toggle Status</button><button>Delete</button></td>
            </tr>
        `);
    };
};