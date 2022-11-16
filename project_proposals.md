# CS 409 Final Project Proposal
**Group Name:** ***HAN***
***Tomoyoshi (Tommy) Kimura - tkimura4***
***Yutong Zhang - yutongz7***
## Proposal I
***Group Formation Platform***
### Problem statement & motivation:
- Group assignments are commonly used in different courses across different subjects. There are studies and research stating that students would benefit from the group assignments. However, there are many reporting bad group assignment experiences. The first problem is the ***difficulty to form a group***, especially for a course with a large class size, such as CS 409. Students are unfamiliar with each other, so they can hardly find a partner with similar interests and complementary characteristics. With this problem in mind, we are eager to address such issue by designing and implementing a platform to address such problem. 
### User Problem
- Essentially, we are trying to create a web app platform for any group required community to form a group. The user group spans from students from any level, to any online webinar or event that requires group formation. This platform would be extremely beneficial to those who are unfamiliar with each others. 
### Basic Design
- We plan to implement a ***two-sided matching model*** to improve the group formation process, by highlighting the potential **complementarities** and **substitutions** among partner characteristics. Users could view others’ basic information, including experience, and skills, with their goals and opinions of group assignment. Each user would be considered as a data point on the database, and their skills, goals, requirements, expectations, etc, would be the different attributes.
#### Frontend
- We are planning to use ***React*** as our main Frontend framework
#### Backend
- We are planning to use PostmanAPI and MongoDB for the backend database and interactions. 
### Other applications
#### Existing Apps
- To form a group, many often used the course communication platform such as Campuswire, Discord, Piazza to search for teammates. There are, of course, other similar app like CatMe made by Purdue University.
#### How are we different
- We are different. Because we are implementing a Two side matching software that maximizes the freedom of the user with enough informatino for the both parties. Campuswire, Discord, etc, often have one user requesting for a group, and then many individuals or groups reply, or one group requesting a few more users, and a few individuals reply. We provide a mean in both direction, providing maximum freedom and transparency between any existing groups and the individuals. Inidivduals could see which groups need more people, or any other individual also looking for a group.
------
<div style="page-break-after: always"></div>

## Proposal II
***Group Collaboration Platform***
### Problem statement & motivation:
The second most complaining issue is the unequal contribution in the group, which would decrease the effectiveness of group assignments. Therefore, considering the potential advantages of group assignments, we’d like to develop a collaboration platform to improve the user experience of group assignments by quantifying and visualizing the team contribution for evaluation. This allows both the team members to evaluate their performance based on their contribution, and also allows any regulator or the instructor to measure the group's works distribution.
### User Problem
- Essentially, we are trying to address the unequal distribution of work among the students in any group assignments, by creating a web app platform for any group and the instructor to keep updating their contribution, and eventually quantifies and visualizes the contributions. 
### Basic Design
- We plan to implement a timeline management model that keeps track of the users' uploaded contribution for a created project. The users have to be authenticated to be added to a group, and then uploaded their contribution to the database. Then, there is a dashboard to keep track of each others performance, and visualizes their contributions for evaluation. 
#### Frontend
- We are planning to use ***React*** as our main Frontend framework
#### Backend
- We are planning to use PostmanAPI and MongoDB for the backend database and interactions. 
### Other applications
#### Existing Apps
- There are many apps that have similar features like this. Git is one, with milestones, tags, commit from each users. 
#### How are we different
- The main difference between our project is that we have provided visualization for each contribution. This also provides meaningful metrics to the reporter, and would demonstrate how they have contributed.
------
## Proposal III
***Social platform for resaerch academia***
### Problem statement & motivation:
Research experience is important to both further career and skill development for undergraduate students. However, securing research opportunities is a big challenge as well. One of the most common ways for undergraduate students to engage in research is by volunteering to work with a faculty on one of their projects. Currently, the information for the research, including the introduction or contact information is distributed everywhere, which students might hardly collect. Sending an email is one popular method used for self-introduction, which might have low efficiency. That might also be massive for a faculty to receive a lot of emails every day. A platform for collecting and organizing information for both faculty and students would be beneficial for everyone.
### User Problem
- We aim improve the experience of securing research opportunity by creating a platform that both faculty and students can easier get the information they need.
### Basic Design
- We plan to have a platform where each user would display basic information: students would include their basic skills, school year, research interest, and past experience, and faculty would provide their current projects and their research interests. Each user could be interested and volunteer to be a faculty and the platform would send their basic information to the faculty. The faculty could filter or sort students' information to find the students they need for their project. The information is more organized and the communication would be more efficient, we can consider this as an academic version Linkin platform. 
#### Frontend
- We are planning to use ***React*** as our main Frontend framework
#### Backend
- We are planning to use PostmanAPI and MongoDB for the backend database and interactions. 
### Other applications
#### Existing Apps
- Currently, different faculty would have their own website for their research. Some of them use the survey to collect students' information. Also, students would get an email with information about research opportunities. 
#### How are we different
- The main difference between our project is that we would organize the information in one place with a clearer structure so that people can easier get the information they want. 
