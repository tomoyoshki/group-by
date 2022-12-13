# Fall 2022 CS 409 Final Project


***Tomoyoshi (Tommy) Kimura - tkimura4@illinois.edu***

***Yutong Zhang - yutongz7@illinois.edu***

We created this web application to promote group formation within a community by explictly removing all the external characteristics of one to improve the collaboration of people with different background, especially at current time when projects have been online rather than in person. This is often referred to as Implicit bias; when a person prefers to form group with others that share same characteristics, such as gender, race, and age groups. This reduces the diversity within each group, which is often non-trivial. It is hard for individual to form groups with people truly matching their skills, goals, and behaviors. To achieve more efficient group formation, we implemented **Group By**. 

## Usage


### Installing dependencies

```bash
npm install
cd server
npm install
```

### Run frontend

```bash
npm start
```

### Run server 

```bash
cd server
npm start
```

## Application usage

### User authentication

Group By supports user authentication. User could use their email to register an account with password. 

### User types

Group By, similar to other education platform, offers views for both the instructor and the students.

#### Instructor View

Instructor could create an project assignment for students to join. Each project assignment generates a code like GradeScope for students to join the group. When creating an assignment, the instructor needs to specify the name of the assignment, the start date, and the end date which will provides a progress bar to visualize the deadline. 

Instructor has the access to view the students in the project, but could not send or receive request from any of the student. We hope to decentralize the process of group formation to maximize the students' accountability and ability to form a team. 

#### Student View

Students could join any number of groups with the join code provided by the instructor. 

After joining the group, users could view all other students assigned to the project. Skills and descriptions of other students for this project is also visible for the user to choose their interest. Eventually, the user could  and could send request to ask to join their teams or invite individuals to join students' team. 

We implemented a notification system such that students could view all the requests sent by other users for all different projects.

Students within each assignment could see how others have already formed their groups to see skill alignments. 
