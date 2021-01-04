pipeline {
    agent any
    stages {
        stage('build') {
            steps {
                sh 'echo "==================================="'
                sh 'echo "          MAFIA MODERATOR          "'
                sh 'echo "          BUILD STAGE              "'
                sh 'echo "==================================="'

                git 'https://github.com/birthdaysgift/mafia-moderator'
                sh 'docker-compose --file docker-compose.common.yml \
                                   --file docker-compose.prod.yml   \
                                   up --build --detach'
            }
        }
        stage('test') {
            steps {
                sh 'echo "==================================="'
                sh 'echo "          MAFIA MODERATOR          "'
                sh 'echo "          TEST STAGE               "'
                sh 'echo "==================================="'
            }
        }
        stage('deploy') {
            steps {
                sh 'echo "==================================="'
                sh 'echo "          MAFIA MODERATOR          "'
                sh 'echo "          DEPLOY STAGE             "'
                sh 'echo "==================================="'
            }
        }
    }
}