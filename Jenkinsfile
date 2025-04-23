pipeline {
    agent any

    environment {
        COMPOSE_DOCKER_CLI_BUILD = '1'
        DOCKER_BUILDKIT = '1'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/Kousik1314/Budget-Buddy.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image using docker-compose...'
                sh 'docker compose build'
            }
        }

        stage('Run Container') {
            steps {
                echo 'Running Docker container...'
                sh 'docker compose up -d'
            }
        }

        stage('Health Check') {
            steps {
                echo 'Checking if app is up on port 3000...'
                sh 'curl -I http://localhost:3000 || true'
            }
        }

        stage('Cleanup (Optional)') {
            steps {
                echo 'Tearing down container (optional)...'
                sh 'docker compose down'
            }
        }
    }
}
