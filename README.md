# 💰 Budget Buddy

**Live Demo:** [https://budgetbuddybykousik.netlify.app](https://budgetbuddybykousik.netlify.app)  

---

## 🌟 Overview

**Budget Buddy** is a modern web application designed to help you manage your finances effortlessly. With an intuitive interface and powerful features, it allows you to track your income and expenses, set budgets, and gain insights into your spending habits.

---

## ✨ Key Features

- ✅ **Real-Time Expense Tracking** – Log your income and expenses instantly  
- ✅ **Budget Management** – Set monthly budgets and monitor your spending  
- ✅ **Visual Insights** – Interactive charts to visualize your financial data  
- ✅ **Responsive Design** – Seamless experience across all devices  
- ✅ **Data Persistence** – Your data remains intact across sessions  

---

## 🛠️ Technologies Used

### Frontend:
- ⚛️ **React.js** – JavaScript library for building user interfaces  
- 🎨 **Tailwind CSS** – Utility-first CSS framework for styling  
- 📦 **Vite** – Next-generation, fast build tool and development server  

### CI/CD:
- 🤖 **Jenkins** – Automation server for continuous integration and continuous delivery  

### Deployment:
- 🌐 **Netlify** – Platform for deploying web projects with continuous integration  

### Containerization:
- 🐳 **Docker** – Platform for developing, shipping, and running applications in containers


## 📦 Installation

1️⃣ **Clone the repository:**

```bash
git clone https://github.com/Kousik1314/Budget-Buddy.git
```

2️⃣ **Navigate to the project directory:**

```bash
cd Budget-Buddy
```

3️⃣ **Install dependencies:**

```bash
npm install
```

4️⃣ **Start the development server:**

```bash
npm run dev
```


## 🤖 Jenkins for CI/CD

You can also automate your build and deployment process using **Jenkins**.

### 📦 Set Up Jenkins Pipeline

1️⃣ **Install Jenkins and required plugins**  
Ensure Jenkins is installed on your machine, and you have the necessary plugins (e.g., Git, NodeJS, Docker).

2️⃣ **Set up a Jenkinsfile**  
In the root of your project, create a `Jenkinsfile` to define the CI/CD pipeline. Example:

```groovy
pipeline {
    agent any
    stages {
        stage('Install Dependencies') {
            steps {
                script {
                    sh 'npm install'
                }
            }
        }
        stage('Run Tests') {
            steps {
                script {
                    sh 'npm test'
                }
            }
        }
        stage('Build and Deploy') {
            steps {
                script {
                    sh 'npm run build'
                    sh 'npm run deploy'
                }
            }
        }
    }
}
```

3️⃣ **Run the Jenkins pipeline**  
After configuring your Jenkins pipeline, trigger the build process either manually or automatically on code changes.

4️⃣ **Monitor the build progress**  
Visit the Jenkins dashboard to monitor the build, test, and deployment status.

- 📚 [Jenkins Documentation](https://www.jenkins.io/doc/)


## 🐳 Docker Support

You can also run this project using **Docker**.

### 📦 Build and Run with Docker Compose

1️⃣ **Make sure Docker and Docker Compose are installed**  
2️⃣ **In the project root, run:**
```bash
docker-compose up --build
```
3️⃣ **Visit the app in your browser:**
```
http://localhost:3000
```

## 🚀 How to Use

### 📥 **Add Expense:**
- Click the **"Add Expense"** button on the top right
- Enter details like amount, category, and date
- Click **Submit** to save the expense

### 📊 **View Dashboard:**
- Visit the **Dashboard** for an overview of your spending
- See:
  - ✅ **Total Expenses**
  - 📆 **Expenses This Month**
  - 🔢 **Total Transactions**
- Graphs include:
  - 📈 **Monthly Spending** (last 6 months)
  - 🍽️ **Spending by Category** (pie chart view)

### 📂 **Navigate Sections:**
- Use the top nav bar to explore:
  - **Dashboard**: Summary of activity
  - **Expenses**: List of all transactions
  - **Reports**: Detailed analytics
  - **Categories**: Manage and customize expense categories

> 💡 Designed with smooth UI, gradients, and responsive layout.

## 📸 Screenshots

### Login/Signup Page
![Screenshot 2025-04-25 005413](https://github.com/user-attachments/assets/40013829-9139-44f1-8f8b-4e2e7cc45d9c)  
A screenshot of the login/signup page where users can access their accounts or register a new one.

### Dashboard
![Screenshot 2025-04-25 005228](https://github.com/user-attachments/assets/4012dbe7-5831-4617-bc34-2ffd645eb240)  
An overview of the dashboard showcasing a summary of your income, expenses, and other financial data.

### Expenses Page
![Screenshot 2025-04-25 005244](https://github.com/user-attachments/assets/fb69607e-1125-4823-9d78-b32761d4aaff)  
A screenshot of the expenses page where users can view and manage their spending.

### Reports Page
![Screenshot 2025-04-25 005252](https://github.com/user-attachments/assets/01cd8a0d-9ae4-4f76-9c1b-a025030300ed)  
A detailed view of the reports page showing various insights and visualizations of your financial data.

### Categories Page
![Screenshot 2025-04-25 005307](https://github.com/user-attachments/assets/ff7b9648-034a-4c93-8f0e-04a165f98be6)  
A screenshot of the categories page where users can categorize and manage their income and expenses.

### Profile Page
![Screenshot 2025-04-25 005400](https://github.com/user-attachments/assets/1da940aa-7eff-426e-8926-db7e8a4f5ec8)  
A screenshot of the profile page where users can view and update their personal information.



## 📄 License

This project is licensed under the **MIT License**.

Permission is hereby granted, free of charge, to any person obtaining a copy  
of this software and associated documentation files (the "Software"), to deal  
in the Software without restriction, including without limitation the rights  
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell  
copies of the Software, and to permit persons to whom the Software is  
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all  
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR  
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,  
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE  
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER  
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,  
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE  
SOFTWARE.

For more details, please refer to the [LICENSE](https://github.com/Kousik1314/Budget-Buddy/blob/main/LICENSE) file in this repository.


## 👨‍💻 Author

**Kousik Maity**  
GitHub: [@Kousik1314](https://github.com/Kousik1314)

---

## 🙏 Acknowledgments

- 📚 [React Documentation](https://reactjs.org/docs/getting-started.html)  
- 🎨 [Tailwind CSS Documentation](https://tailwindcss.com/docs)  
- 🌐 [Netlify Documentation](https://docs.netlify.com/)
- - 🐳 [Docker Documentation](https://docs.docker.com/)
- 🤖 [Jenkins Documentation](https://www.jenkins.io/doc/)
- 
Made with ❤️ by Kousik Maity

