pipeline {
  agent any
  options { timestamps() }

  environment {
    // Docker Desktop est installe pour l'utilisateur : on ajoute son dossier bin au PATH
    PATH = "C:/Users/im/AppData/Local/Programs/DockerDesktop/resources/bin;${env.PATH}"
    DOCKERHUB_USER = 'hamagh04'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Docker') {
      steps {
        bat 'docker version'
        bat 'docker compose version'
      }
    }

    stage('Build images') {
      steps {
        bat 'docker build -t mern-server ./server'
        bat 'docker build -t mern-client ./client'
      }
    }

    stage('Deploy (docker compose)') {
      steps {
        bat """
          docker rm -f mongodb server client 2>nul || ver > nul
          docker compose up -d --build
          docker compose ps
        """
      }
    }

    stage('Smoke Test') {
      steps {
        bat """
          ping -n 11 127.0.0.1 > nul
          curl -s http://localhost:9000/api/health | find "API is running"
          curl -I http://localhost:3000 | find "200 OK"
        """
      }
    }

    stage('Push (Docker Hub)') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                                          usernameVariable: 'USER',
                                          passwordVariable: 'PASS')]) {
          bat """
            echo %PASS%| docker login -u %USER% --password-stdin || exit /b 1
            docker tag mern-server %DOCKERHUB_USER%/mern-server:latest
            docker tag mern-client %DOCKERHUB_USER%/mern-client:latest
            docker push %DOCKERHUB_USER%/mern-server:latest
            docker push %DOCKERHUB_USER%/mern-client:latest
          """
        }
      }
    }
  }

  post {
    success { echo 'Build + Deploy + Test + Push OK : mongodb, server (9000) et client (3000) sont en ligne' }
    failure { echo 'Echec du pipeline MERN' }
  }
}
