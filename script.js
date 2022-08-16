/* Define app elements. */
const app = document.getElementById("app")

const title1 = document.createElement("h1")
app.appendChild(title1)
title1.innerText = "Kevään 2022 ylioppilaat lukioittain"

const title2 = document.createElement("h2")
app.appendChild(title2)
title2.innerText = "Hae etu- tai sukunimen perusteella:"

const input = document.createElement("input")
app.appendChild(input)

const title3 = document.createElement("h2")
app.appendChild(title3)
title3.innerText = "Hae lukion perusteella:"

const select = document.createElement("select")
app.appendChild(select)

const defaultOption = document.createElement("option")
select.appendChild(defaultOption)
defaultOption.text = "Valitse lukio"
defaultOption.value = "default"

const result = document.createElement("div")
app.appendChild(result)

/* Function to get and parse data. */
async function getData() {
  const response = await fetch("test-material.csv")
  const data = await response.text()
  const table = data.split("\n").slice(1)

  const studentsArray = []
  const tempHighschoolsArray = []

  table.forEach(row => {
    const column = row.trim().split(";")
    const id = parseInt(column[0])
    const lastName = column[1]
    const firstName = column[2]
    const highschool = column[3]

    const student = {
      id,
      lastName,
      firstName,
      highschool,
    }

    studentsArray.push(student)
    tempHighschoolsArray.push(highschool)  
  })

  const tempSet = new Set(tempHighschoolsArray)
  const highschoolsArray = Array.from(tempSet).sort()

  return { studentsArray, highschoolsArray }
}

/* Function to populate select. */
function populateSelect(data) {
  const highschoolsArray = data

  for (let i = 0; i < highschoolsArray.length; i++) {
    const highschool = highschoolsArray[i]
    const option = document.createElement("option")
    select.appendChild(option)
    option.text = highschool
    option.value = highschool
  }
}

/* This function runs the whole app. */
async function main() {
  /* Get data. */
  const { studentsArray, highschoolsArray } = await getData()

  /* Populate select. */
  populateSelect(highschoolsArray)

  /* Add event listener for select. */
  select.addEventListener("change", (event) => {
    const selectedHighschool = event.target.value
  
    /* If there are childnodes from before, delete them. */
    while (result.hasChildNodes()) {
      result.removeChild(result.firstChild)
    }

    /* Clear input value. */
    input.value = ""

    /* Filter students by highschool. */
    const filteredStudents = studentsArray.filter(student =>
      (student.highschool).includes(selectedHighschool))
      
    /* Loop and append filtered students as new elements. */
    for (let i = 0; i < filteredStudents.length; i++) {
      const lastName = filteredStudents[i].lastName
      const firstName = filteredStudents[i].firstName
      const highschool = filteredStudents[i].highschool

      const student = document.createElement("p")
      result.appendChild(student)
      student.innerHTML = `<b>${lastName}</b>, ${firstName}, ${highschool}`
    }
  })

  /* Add event listener for input. */
  input.addEventListener("input", (event) => {
    const filterValue = event.target.value

    /* If there are childnodes from before, delete them. */
    while (result.hasChildNodes()) {
      result.removeChild(result.firstChild)
    }

    /* Select defaultOption to reset select. */
    defaultOption.selected = "true"

    /* Filter students. */
    if (filterValue.length >= 3) {
      const filteredStudents = studentsArray.filter(student =>
        (student.lastName).toLowerCase().includes(filterValue.toLowerCase()) ||
        (student.firstName).toLowerCase().includes(filterValue.toLowerCase())
        )

      /* Loop and append filtered students as new elements. */
      for (let i = 0; i < filteredStudents.length; i++) {
        const lastName = filteredStudents[i].lastName
        const firstName = filteredStudents[i].firstName
        const highschool = filteredStudents[i].highschool

        const student = document.createElement("p")
        result.appendChild(student)
        student.innerHTML = `<b>${lastName}</b>, ${firstName}, ${highschool}`
      }
    }
  })
}

/* Call main(). */
main()


