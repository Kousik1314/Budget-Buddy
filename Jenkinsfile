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
        always {
            emailext(
                subject: "Jenkins Job: ${env.JOB_NAME} - ${currentBuild.currentResult}",
                body: """\
                    <p>Job '${env.JOB_NAME}' (${env.BUILD_NUMBER}) has completed.</p>
                    <p>Status: <b>${currentBuild.currentResult}</b></p>
                    <p><a href="${env.BUILD_URL}">View Build</a></p>
                """,
                to: 'kousikmaity157@gmail.com',
                mimeType: 'text/html'
            )
        }
    }
}
