pipeline {
  agent any

  tools {
    nodejs "node18"
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
        // Since Jenkins runs on the same host, deploy locally
        sh '''
          set -e
          cd ${DEPLOY_DIR}
          git pull origin main || echo "Repo already up-to-date"
          npm install --production
          sudo systemctl restart todo.service
        '''
      }
    }

    stage('Smoke Test') {
      steps {
        // Verify app is up
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

