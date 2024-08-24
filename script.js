document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('add-task-button');
    const taskInput = document.getElementById('task-input');
    const recurrenceInput = document.getElementById('recurrence-input');
    const taskList = document.getElementById('task-list');

    addButton.addEventListener('click', () => {
        const taskValue = taskInput.value.trim();
        const recurrence = recurrenceInput.value;
        if (taskValue === '') return;

        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                li.classList.add('done');
                showTrashBin();
                if (recurrence) {
                    scheduleNextOccurrence(li, recurrence);
                }
            } else {
                li.classList.remove('done');
                hideTrashBin();
            }
        });

        li.appendChild(checkbox);
        li.appendChild(document.createTextNode(taskValue));

        const removeIcon = document.createElement('span');
        removeIcon.textContent = '×'; 
        removeIcon.classList.add('remove-icon');
        removeIcon.addEventListener('click', () => {
            li.classList.add('done');
            setTimeout(() => {
                const trashBin = document.getElementById('trash-bin');
                if (!trashBin) {
                    const newTrashBin = document.createElement('span');
                    newTrashBin.textContent = '🗑️'; 
                    newTrashBin.id = 'trash-bin';
                    document.body.appendChild(newTrashBin);
                }
                const trashBinElement = document.getElementById('trash-bin');
                trashBinElement.style.opacity = 1; 

                li.style.position = 'absolute'; 
                li.style.transition = 'none'; 

                const trashBinRect = trashBinElement.getBoundingClientRect();
                const liRect = li.getBoundingClientRect();
                const offsetX = trashBinRect.left - liRect.left + (trashBinRect.width / 2 - liRect.width / 2);
                const offsetY = trashBinRect.top - liRect.top + (trashBinRect.height / 2 - liRect.height / 2);

                li.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0.5)`;
                li.style.opacity = 0;

                setTimeout(() => {
                    taskList.removeChild(li);
                    hideTrashBin();
                }, 500); 
            }, 300); 
        });

        li.appendChild(removeIcon);
        taskList.appendChild(li);
        taskInput.value = '';
        recurrenceInput.value = '';
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addButton.click();
        }
    });

    function showTrashBin() {
        const trashBin = document.getElementById('trash-bin');
        if (trashBin) {
            trashBin.style.opacity = 1;
        }
    }

    function hideTrashBin() {
        const trashBin = document.getElementById('trash-bin');
        if (trashBin) {
            trashBin.style.opacity = 0;
        }
    }

    function scheduleNextOccurrence(taskItem, recurrence) {
        const now = new Date();
        let nextOccurrence;

        if (recurrence === 'daily') {
            nextOccurrence = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        } else if (recurrence === 'weekly') {
            nextOccurrence = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        }

        setTimeout(() => {

            taskItem.classList.remove('done');
            addButton.click(); 
        }, nextOccurrence.getTime() - now.getTime());
    }
});
