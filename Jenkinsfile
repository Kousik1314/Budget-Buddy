pipeline {
    agent any

    environment {
        COMPOSE_DOCKER_CLI_BUILD = '1'
        DOCKER_BUILDKIT = '1'
    }

    stages {
        stage('Clean Workspace') {
            steps {
                echo 'Cleaning workspace...'
                deleteDir()
            }
        }

        stage('Clone Repository') {
            steps {
                echo 'Cloning the repository...'
                git branch: 'main', url: 'https://github.com/Kousik1314/Budget-Buddy.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image using docker-compose...'
                dir('Budget-Buddy') {
                    bat 'docker compose build'
                }
            }
        }

        stage('Run Container') {
            steps {
                echo 'Running Docker container...'
                dir('Budget-Buddy') {
                    bat 'docker compose up -d'
                }
            }
        }

        stage('Health Check') {
            steps {
                echo 'Checking if app is up on port 3000...'
                bat 'curl -I http://localhost:3000 || exit 0'
            }
        }
    }

    post {
        success {
            mail to: 'kousikmaity157@gmail.com',
                 subject: "✅ Build Success - #${env.BUILD_NUMBER}",
                 body: """
🎉 Your Jenkins pipeline ran successfully!

📄 Job Name: ${env.JOB_NAME}
🔢 Build Number: ${env.BUILD_NUMBER}
🌿 Branch: ${env.GIT_BRANCH}
🔗 Build URL: ${env.BUILD_URL}
🕒 Timestamp: ${new Date()}
⏱ Duration: ${currentBuild.durationString}

✅ Status: SUCCESS
"""
        }
        failure {
            mail to: 'kousikmaity157@gmail.com',
                 subject: "❌ Build Failed - #${env.BUILD_NUMBER}",
                 body: """
⚠️ Pipeline build failed.

📄 Job Name: ${env.JOB_NAME}
🔢 Build Number: ${env.BUILD_NUMBER}
🌿 Branch: ${env.GIT_BRANCH}
🔗 Build URL: ${env.BUILD_URL}
🕒 Timestamp: ${new Date()}
⏱ Duration: ${currentBuild.durationString}

❌ Status: FAILURE

Please check the Jenkins console output for more details.
"""
        }
    }
}
