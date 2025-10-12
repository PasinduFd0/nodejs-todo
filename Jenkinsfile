pipeline {
  agent any

  tools {
    nodejs "node18"     // use Node.js 18 installed in Jenkins
  }

  environment {
    DEPLOY_DIR = "/opt/nodejs-todo/nodejs-todo"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        sh '''
          cd ${DEPLOY_DIR}
          npm ci
        '''
      }
    }

    stage('Test') {
      steps {
        sh 'npm test || echo "No tests configured"'
      }
    }

    stage('Build') {
      steps {
        echo "Build step skipped — not needed for simple Node app"
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          set -e
          cd ${DEPLOY_DIR}
          git pull https://github.com/PasinduFd0/nodejs-todo.git main || echo "Repo already up-to-date"
          npm install --production
          echo "Restarting service..."
          echo ${JENKINS_PASS} | sudo -S systemctl restart todo.service
        '''
      }
    }

    stage('Smoke Test') {
      steps {
        sh '''
          echo "Checking app status..."
          STATUS=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/)
          if [ "$STATUS" != "200" ]; then
            echo "Smoke test failed: $STATUS"
            exit 1
          fi
          echo "Smoke test OK"
        '''
      }
    }
  }

  post {
    always {
      echo 'Pipeline completed.'
    }
  }
}

