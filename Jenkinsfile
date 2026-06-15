pipeline {
    agent any

    environment {
        EC2_HOST = '18.159.94.138'
    }

    stages {
        stage('Build Frontend') {
            steps {
                sh 'docker build --build-arg VITE_API_BASE_URL=/api/v1 -t cinebh-frontend:latest .'
            }
        }

        stage('Push to Registry') {
            steps {
                sh '''
                    docker tag cinebh-frontend:latest ${EC2_HOST}:5000/cinebh-frontend:latest
                    docker push ${EC2_HOST}:5000/cinebh-frontend:latest
                '''
            }
        }
    }
}
