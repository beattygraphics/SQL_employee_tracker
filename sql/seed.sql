USE employeesDB;

INSERT INTO department (name)
VALUES ("Handler");
INSERT INTO department (name)
VALUES ("Agent");
INSERT INTO department (name)
VALUES ("Villan");
INSERT INTO department (name)
VALUES ("Heroin");


INSERT INTO role (title, salary, department_id)
VALUES ("Handler", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Agent", 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Heroin Main", 120000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Villan", 125000, 4);
INSERT INTO role (title, salary, department_id)
VALUES ("Tech Nerd", 250000, 5);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("James", "Bond", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("M", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Corinne", "Dufour" 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Octopussy" 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("May", "Day" 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Natalya", "Simonova" 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Paris", "Carver" 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Solange", "Dimitrios" 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mr.", "Big", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Max", "Zorin", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Elektra", "King", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Emilio", "Largo", 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Hugo", "Drax", 2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Alec", "Trevelyan", 4, 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Rosa", "Klebb", 1, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Francisco", "Scaramanga", 1, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Le", "Chiffre", 1, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ernst Stavro", "Blofeld", 1, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Auric", "Goldfinger", 1, 2);