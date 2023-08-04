import React, { useState, useEffect, useRef } from "react";
import {
  PageContainer,
  EmployeeList,
  EmployeeItem,
  EmployeeForm,
  Input,
  Button,
  Buttons,
  TabButton,
  ShelterForm,
} from "./HomeStyle";
import employees from "../../employeeData";

export default function Home() {
  const employeesCount = useRef(employees.length);

  const [listOfEmployees, setListOfEmployees] = useState(employees);
  const [newEmployee, setNewEmployee] = useState({
    id: employeesCount.current + 1,
    name: "",
    surname: "",
    gender: "male",
  });

  const [valid, setValid] = useState(false);

  const [activeTab, setActiveTab] = useState("list-of-employees");

  const [shelterStorage, setShelterStorage] = useState({
    meters: "0",
    hours: "0",
  });
  const [countByGender, setCountByGender] = useState({
    male: "",
    female: "",
  });

  const [tempStorage, setTempStorage] = useState({
    meters: "0",
    hours: "1",
  });

  const handleChange = (e) => {
    const updateEmployee = { ...newEmployee, [e.target.name]: e.target.value };
    setNewEmployee(updateEmployee);
    validateData(updateEmployee);
  };

  const updateStorage = () => {
    const storageValue = tempStorage;

    let newStorageValue = {};

    const keys = Object.keys(storageValue);

    keys.map((key) => {
      if (parseInt(storageValue[key])) {
        return (newStorageValue[key] =
          parseInt(shelterStorage[key]) + parseInt(storageValue[key]));
      } else {
        return (newStorageValue[key] = parseInt(shelterStorage[key]));
      }
    });

    setShelterStorage(newStorageValue);

    setTempStorage({ meters: "", hours: "" });
  };

  useEffect(() => {
    console.log(tempStorage);
  }, [tempStorage]);

  const validateData = (employee) => {
    if (employee.name.trim().length === 0) {
      return setValid(false);
    } else if (employee.surname.trim().length === 0) {
      return setValid(false);
    }
    setValid(true);
  };

  const handleAdd = () => {
    let pushEmployee = true;

    if (pushEmployee) {
      setListOfEmployees((listOfEmployees) => {
        return [...listOfEmployees, newEmployee];
      });

      employeesCount.current++;
      const updateEmployee = {
        id: employeesCount.current + 1,
        name: "",
        surname: "",
        gender: "male",
      };
      setNewEmployee(updateEmployee);
      setValid(false);
    } else {
      alert("Nedostatek místa propřidání psa.");
    }
  };

  const sectiZamestnance = () => {
    const maleCount = listOfEmployees.filter(
      (employee) => employee.gender === "male"
    ).length;

    const femaleCount = listOfEmployees.filter(
      (employee) => employee.gender === "female"
    ).length;

    return (
      (countByGender.male = maleCount), (countByGender.female = femaleCount)
    );
  };

  const possible = (e) => {
    const updateStorage = { ...tempStorage, [e.target.name]: e.target.value };
    setTempStorage(updateStorage);

    let workLoad = updateStorage.meters / updateStorage.hours;

    let performance;
    performance = countByGender.female * 0.5 + countByGender.male;

    let brTlacitko = document.getElementById("barevneTlacitko");

    if (workLoad <= performance) {
      //   groupPerformanceCoeficient.gPC = "Y";
      brTlacitko.style.backgroundColor = "green";
      brTlacitko.disabled = false;
    } else {
      //   groupPerformanceCoeficient.gPC = "N";
      brTlacitko.style.backgroundColor = "red";
      brTlacitko.disabled = true;
    }
  };

  const handleDelete = (idToDelete) => {
    setListOfEmployees(
      listOfEmployees.filter((employee) => employee.id !== idToDelete)
    );
  };

  return (
    <PageContainer>
      <Buttons>
        <TabButton
          name="list-of-employees"
          data-active={activeTab}
          onClick={() => {
            setActiveTab("list-of-employees");
          }}
        >
          Seznam Zaměstnanců
        </TabButton>
        <TabButton
          name="shelter-storage"
          data-active={activeTab}
          onClick={() => {
            setActiveTab("shelter-storage");
            sectiZamestnance();
          }}
        >
          Činnost
        </TabButton>
      </Buttons>
      {activeTab === "list-of-employees" && (
        <>
          <EmployeeList name="employeeList">
            {listOfEmployees.map((employee) => {
              return (
                <EmployeeItem key={employee.id}>
                  {employee.name}/{employee.surname}/{employee.gender}
                  <button
                    style={{
                      color: "#64766a",
                      fontWeigth: "bolder",
                      border: 2 + "px solid #64766a",
                      borderRadius: 50 + "%",
                      height: 25 + "px",
                      width: 25 + "px",
                    }}
                    onClick={() => {
                      handleDelete(employee.id);
                    }}
                  >
                    X
                  </button>
                </EmployeeItem>
              );
            })}
          </EmployeeList>
          <EmployeeForm>
            <Input
              type="text"
              placeholder="jméno"
              name="name"
              value={newEmployee.name}
              onChange={handleChange}
            />
            <Input
              type="text"
              placeholder="příjmení"
              name="surname"
              value={newEmployee.surname}
              onChange={handleChange}
            />
            <div>
              <Input
                type="radio"
                placeholder="pohlaví"
                name="gender"
                value="male"
                onChange={handleChange}
                defaultChecked
              />
              muž
              <Input
                type="radio"
                placeholder="pohlaví"
                name="gender"
                value="female"
                onChange={handleChange}
              />
              žena
            </div>
            <Button onClick={handleAdd} disabled={!valid}>
              {" "}
              Přidat
            </Button>
          </EmployeeForm>
        </>
      )}
      {activeTab === "shelter-storage" && (
        <>
          <h3>Aktuální zásoby</h3>
          <p>Male:{countByGender.male}</p>
          <p>Female:{countByGender.female}</p>
          {/* <p>perf:{groupPerformanceCoeficient.gPC}</p> */}
          <p>Metry:{shelterStorage.meters} </p>
          <p>Hodiny:{shelterStorage.hours}</p>

          <ShelterForm>
            <Input
              type="number"
              min="0"
              placeholder="Meters"
              name="meters"
              value={tempStorage.meters}
              onChange={possible}
            ></Input>
            <Input
              type="number"
              min="0"
              placeholder="Hours"
              name="hours"
              value={tempStorage.hours}
              onChange={possible}
            ></Input>

            <Button id="barevneTlacitko" onClick={updateStorage}>
              Zadat
            </Button>
          </ShelterForm>
        </>
      )}
    </PageContainer>
  );
}
