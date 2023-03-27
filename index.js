
let data = [
  {
    name: 'To do 1',
    dueDate: '2026-04-16T21:00',
    timestamp: 'Mon Mar 24 2023 18:13:17 GMT+0300 (Eastern European Summer Time)'
  },
  {
    name: 'To do 2',
    dueDate: '2025-05-24T21:00',
    timestamp: 'Mon Mar 21 2023 14:10:00 GMT+0300 (Eastern European Summer Time)'
  },
  {
    name: 'To do 3',
    dueDate: '2025-07-05T18:00',
    timestamp: 'Mon Mar 18 2023 10:00:05 GMT+0300 (Eastern European Summer Time)'
  },

  {
    name: 'To do 4',
    dueDate: '2025-07-05T18:00',
    timestamp: 'Mon Mar 15 2023 11:01:04 GMT+0300 (Eastern European Summer Time)'
  },
]


populateData()

function populateData() {
  sessionStorage.setItem('alldata', JSON.stringify(data));
  const getdata = sessionStorage.getItem('alldata');
  const alldata = JSON.parse(getdata)
  createElement(alldata)
}

function createElement(alldata) {

  const myList = document.getElementById('myList')
  for (d of alldata) {

    const listItem = document.createElement('div')
    listItem.classList.add('unCheckedListItem', 'allListItems')
    listItem.setAttribute('name', d.name)

    const checkBox = document.createElement('input')
    checkBox.type = 'checkbox'
    checkBox.className = 'checkbox'
    checkBox.setAttribute('data-checkbox-name', d.name)

    checkBox.onchange = (e) => {
      itemChecked(e);
    };

    const discription = document.createElement('p')
    discription.className = 'discription'
    discription.innerText = d.name

    const deadline = document.createElement('p')
    deadline.className = 'deadline'
    deadline.innerText = timeLeftToDeadline(d.dueDate)

    const deleteButton = document.createElement('button')
    deleteButton.className = 'deleteButton'
    deleteButton.type = 'submit'
    deleteButton.innerText = 'delete'
    deleteButton.setAttribute('item-by-name', d.name)
    checkBox.checked = d.checked
    deleteButton.onclick = (e) => {
      deleteItem(e);
    };

    listItem.append(checkBox, discription, deadline, deleteButton)
    myList.prepend(listItem)

    if (d.state === 'checked') {
      listItem.className = 'checkedListItem'
      checkBox.checked = true
    }
  }
}


const form = document.querySelector('form')
form.addEventListener('submit', (e) => {
  e.preventDefault()
  addToList()
})


function deleteItem(e) {
  if (window.confirm("Are you sure you want to delete this entry?")) {
    const getdata = sessionStorage.getItem('alldata');
    const alldata = JSON.parse(getdata)
    const deleteButtonName = e.target.getAttribute('item-by-name');
    const allListItems = document.querySelectorAll('.allListItems');

    for (item of allListItems) {
      const itemName = item.getAttribute('name')
      if (deleteButtonName === itemName) {
        item.remove()
        break
      }
    }
    for (let i = 0; i < alldata.length; i++) {
      if (alldata[i].name === deleteButtonName) {
        data.splice(i, 1)
        break;
      }
    }
  }
}


function addToList() {
  const discription = document.getElementById('inputDiscription').value
  const deadline = document.getElementById('inputDate').value
  let array = []
  let newRecord = {}
  for (d of data) {
    if (discription === d.name) {
      alert("Item with this name allready exists")
      return
    }
  }
  newRecord.name = discription
  newRecord.dueDate = deadline
  newRecord.timestamp = new Date()
  data.push(newRecord)
  array.push(newRecord)
  createElement(array)
  form.reset()
}



function timeLeftToDeadline(deadline) {
  const deadlineDate = new Date(deadline);
  const currentDate = new Date();
  const timeDiff = deadlineDate.getTime() - currentDate.getTime();
  if (timeDiff < 0) {
    return "no deadline"
  }
  else {
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    return `${days} days, ${hours}h, ${minutes}min`;
  }

}


function itemChecked(e) {
  const itemName = e.target.getAttribute('data-checkbox-name');
  const listItems = document.querySelectorAll('.unCheckedListItem');
  const checkedListItems = document.querySelectorAll('.checkedListItem')
  const chBox = e.target;
  const listLenght = listItems.length

  if (chBox.checked) {
    for (item of listItems) {
      const listItemName = item.getAttribute('name');
      if (listItemName === itemName) {
        item.classList.replace('unCheckedListItem', 'checkedListItem')
        setTimeout(() => moveItemDown(item), 50)
        for (d of data) {
          if (d.name === itemName) {
            d.state = 'checked'
            d.timeCompleted = new Date()
            break;
          }
        }
        break;
      }
    }
  }


  else if (!chBox.checked) {
    for (item of checkedListItems) {
      const listItemName = item.getAttribute('name');
      if (listItemName === itemName) {
        item.classList.replace('checkedListItem', 'unCheckedListItem')
        for (d of data) {
          if (d.name === itemName) {
            d.state = 'unchecked'
            delete d.timeCompleted
            moveItemUp(item)
            break;
          }
        }
        break;
      }
    }
  }
}


function moveItemDown(item) {
  if (item.classList.contains('checkedListItem')) {
    if (item.nextElementSibling) {
      const nextItem = item.nextElementSibling
      if (nextItem.classList.contains('checkedListItem')) {
        item.parentNode.insertBefore(item, nextItem)
        return

      } else if (nextItem) {
        item.parentNode.insertBefore(nextItem, item);
        moveItemDown(item)
      }
    }
  }
}

function moveItemUp(item) {
  if (item.classList.contains('unCheckedListItem')) {
    if (item.previousElementSibling) {
      const previoustItem = item.previousElementSibling
      if (previoustItem.classList.contains('checkedListItem')) {
        item.parentNode.insertBefore(item, previoustItem)
        moveItemUp(item)
      }
    }
  }
}


const filter = document.getElementById('filter')
filter.addEventListener('change', (e) => {
  const selected = e.target.selectedIndex;
  if (selected === 0) {
    newestAtTop()
  }
  else if (selected === 1) {
    leastTimeLeft()
  }
  else if (selected === 2) {
    recentlyCompleted()
  }
})


function leastTimeLeft() {
  function compareTimeLeft(item1, item2) {
    const now = new Date();
    const timeLeft1 = new Date(item1.dueDate) - now;
    const timeLeft2 = new Date(item2.dueDate) - now;
    return timeLeft2 - timeLeft1;
  }
  data.sort(compareTimeLeft)
  document.getElementById('myList').innerHTML = ''
  createElement(data)
}


newestAtTop()
function newestAtTop() {
  function compareTimeAdded(item1, item2) {
    const now = new Date();
    const timeDifference1 = new Date(item1.timestamp) - now;
    const timeDifference2 = new Date(item2.timestamp) - now;
    return timeDifference1 - timeDifference2;
  }
  data.sort(compareTimeAdded)
  document.getElementById('myList').innerHTML = ''
  createElement(data)
}


function recentlyCompleted() {
  const completedItems = [];
  const incompleteItems = [];

  data.forEach(item => {
    if (item.timeCompleted) {
      completedItems.push(item);
    } else {
      incompleteItems.push(item);
    }
  });

  completedItems.sort((item1, item2) => item2.timeCompleted - item1.timeCompleted)
  const sortedData = [...completedItems, ...incompleteItems];

  document.getElementById('myList').innerHTML = '';
  createElement(sortedData.reverse());
}
