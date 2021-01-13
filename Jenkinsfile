pipeline {
    agent any
    stages {
        stage('build') {
            steps {
                sh '''set +x
                echo "========================================================="
                echo "                   MAFIOSO | BUILD                       "
                echo "========================================================="
                set -x'''

                git 'https://github.com/birthdaysgift/mafioso'
                sh 'chmod +x ./compose.sh && ./compose.sh prod up'
            }
        }
        stage('test') {
            steps {
                sh '''set +x
                echo "========================================================="
                echo "                   MAFIOSO | TEST                        "
                echo "========================================================="
                set -x'''
                sh 'chmod +x ./compose.sh && ./compose.sh prod test'
            }
        }
        stage('deploy') {
            steps {
                sh '''set +x
                echo "========================================================="
                echo "                   MAFIOSO | DEPLOY                      "
                echo "========================================================="
                set -x'''
            }
        }
    }
}