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

        stage('Deploy') {
            steps {
                sh '''
                    docker save cinebh-frontend:latest | gzip > cinebh-frontend.tar.gz
                    scp -i /var/lib/jenkins/.ssh/id_ed25519 -o StrictHostKeyChecking=no \
                        cinebh-frontend.tar.gz ec2-user@${EC2_HOST}:/home/ec2-user/
                    ssh -i /var/lib/jenkins/.ssh/id_ed25519 -o StrictHostKeyChecking=no ec2-user@${EC2_HOST} "
                        docker load < /home/ec2-user/cinebh-frontend.tar.gz
                        cd /home/ec2-user
                        docker-compose up -d frontend
                        docker-compose ps
                    "
                '''
            }
        }
    }
}
