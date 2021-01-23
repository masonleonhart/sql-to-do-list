$(() => {
    console.log('JQ and JS');
    getTasks();
});

function getTasks() {
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
    $('#viewTasks').empty();

    for (const task of tasks) {
        $('#viewTasks').append(`
            <tr>
                <td>${task.name}</td>
                <td>${task.description}</td>
                <td>${task.status}</td>
                <td><Button>Complete</button><button>Delete</button></td>
            </tr>
        `);
    };
};