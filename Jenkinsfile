pipeline {
  agent any
  options { timestamps() }

  environment {
    // Docker Desktop est installe pour l'utilisateur : on ajoute son dossier bin au PATH
    PATH = "C:/Users/im/AppData/Local/Programs/DockerDesktop/resources/bin;${env.PATH}"
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
        // Construit les images du serveur (./server) et du client (./client)
        bat 'docker compose build'
      }
    }

    stage('Deploy (docker compose)') {
      steps {
        bat """
          docker rm -f mongodb server client 2>nul || ver > nul
          docker compose up -d
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
  }

  post {
    success { echo 'Build + Deploy + Test OK : mongodb, server (9000) et client (3000) sont en ligne' }
    failure { echo 'Echec du pipeline MERN' }
  }
}
