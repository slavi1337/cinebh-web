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

        stage('Deploy') {
            steps {
                sh '''
                    ssh -i /var/lib/jenkins/.ssh/id_ed25519 -o StrictHostKeyChecking=no ec2-user@${EC2_HOST} "
                        cd /home/ec2-user
                        docker-compose pull frontend
                        docker-compose up -d frontend
                        docker-compose ps
                    "
                '''
            }
        }
    }
}
