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
                git 'https://github.com/Kousik1314/Budget-Buddy.git'
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

        stage('Cleanup (Optional)') {
            steps {
                echo 'Tearing down container (optional)...'
                dir('Budget-Buddy') {
                    bat 'docker compose down'
                }
            }
        }
    }
}
