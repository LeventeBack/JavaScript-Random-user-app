const RANDOM_USER_API_URL = "https://randomuser.me/api/?results="
const TEAM_LOCAL_STORAGE_KEY = 'bussiness.team'
const bussinessTeam = JSON.parse(localStorage.getItem(TEAM_LOCAL_STORAGE_KEY)) || {}

const bossContainer = document.querySelector('[data-boss-container]')
const employeeContainer = document.querySelector('[data-employee-container]')
const newUserContainer = document.querySelector('[data-new-users-container]')

const detailsTemplate = document.getElementById('details-template')
const formTemplate = document.getElementById('form-template')

function addEventListeners(){
    const newUserForms = document.querySelectorAll('[data-new-user-form]')
    newUserForms.forEach(form => {
        form.addEventListener('submit', formSubmitEvent ,{once : true})
    })

    const fireButtons =  document.querySelectorAll(' .fire-btn')
    fireButtons.forEach(button => {
        button.addEventListener('click', e => {
            e.target.closest('div').remove()
            save()
        },{once : true}) 
    });

    const  promoteButtons =document.querySelectorAll('.promote-btn')
    promoteButtons.forEach(button => {
        button.addEventListener('click', e => {
            replaceBoss(e.target.closest('div'))
            e.target.closest('div').remove()            
            addEventListeners()
            save()
        })
    })
} 

function save(){
    bussinessTeam.boss =  bossContainer.innerHTML
    bussinessTeam.employees = employeeContainer.innerHTML
    localStorage.setItem(TEAM_LOCAL_STORAGE_KEY, JSON.stringify(bussinessTeam))
}

function render(){
    bossContainer.innerHTML = bussinessTeam.boss   
    employeeContainer.innerHTML = bussinessTeam.employees
}

function formSubmitEvent(event){
    event.preventDefault()
    const form = event.target
    const selectedPosition = form.querySelector('select').value
    if(selectedPosition ===  'Hire as:')  return
    const userInfoDiv = form.closest('.candidat')
    if(selectedPosition === 'employee'){
        createNewEmployee(userInfoDiv)
    } else if(selectedPosition === 'ceo') {
        replaceBoss(userInfoDiv)
    }
    userInfoDiv.remove()
    replaceOldUser()
    save()
}

async function replaceOldUser(){
    const user = await getNewUser(1)  
    createNewUser(user[0])
    addEventListeners()
}

function replaceBoss(userInfoDiv){
    bossContainer.innerHTML = ""
    const div = document.createElement('div')
    div.classList.add('person')
    div.innerHTML ='<h3>Chief Executive Officer (CEO)</h3>'

    const img = document.createElement('img') 
    img.src = userInfoDiv.querySelector('img').src
    
    const detailsSection = document.createElement('section')
    detailsSection.classList.add('details')
    detailsSection.innerHTML = userInfoDiv.querySelector('.details').innerHTML

    const button = document.createElement('button')
    button.classList.add('fire-btn')
    button.innerText = "Fire"

    div.appendChild(img)
    detailsSection.append(button)
    div.appendChild(detailsSection)
    bossContainer.appendChild(div)
}

function createNewEmployee(userInfoDiv){
    const div = document.createElement('div')
    div.classList.add('employee')

    const img = document.createElement('img') 
    img.src = userInfoDiv.querySelector('img').src
    
    const detailsDiv = document.createElement('div')
    detailsDiv.classList.add('details')
    detailsDiv.innerHTML = userInfoDiv.querySelector('.details').innerHTML

    const button = document.createElement('button')
    button.classList.add('fire-btn')
    button.innerText = "Fire"

    const button2 = document.createElement('button')
    button2.classList.add('promote-btn')
    button2.innerText = "Promote"

    div.appendChild(img)
    div.appendChild(detailsDiv)
    div.appendChild(button)
    div.appendChild(button2)
    employeeContainer.appendChild(div)
}

function getNewUser(number){
    return fetch(RANDOM_USER_API_URL+number)
    .then(res => res.json())
    .then(data => data.results)
}

async function renderNewUser(){
    const users = await getNewUser(3)
    newUserContainer.innerHTML=""
    users.forEach(user => {
        createNewUser(user)
    });
    addEventListeners()
}

function createNewUser(user){
    const div = document.createElement('div')
    div.classList.add('candidat')
    const img = createImage(user)
    const details  = createDetals(user)
    const form = document.importNode(formTemplate.content, true)
    div.appendChild(img)
    div.appendChild(details)
    div.appendChild(form)
    newUserContainer.appendChild(div)
}

function createImage(user) {
    const img = document.createElement('img')
    img.src =  user.picture.large
    return img
}

function createDetals(user){
    const details = document.importNode(detailsTemplate.content, true)
    details.querySelector('[data-name]').innerText = `${user.name.title}. ${user.name.last} ${user.name.first}`
    details.querySelector('[data-birthday]').innerText = formatDate(user.dob.date)
    details.querySelector('[data-gender]').innerText =  user.gender
    details.querySelector('[data-email]').innerText =  user.email
    details.querySelector('[data-phone]').innerText =  user.cell
    return details
}

function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

renderNewUser()
render()