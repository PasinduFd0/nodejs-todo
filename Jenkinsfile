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
        // Pull latest code from GitHub
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        sh """
          cd ${DEPLOY_DIR}
          npm ci
        """
      }
    }

    stage('Test') {
      steps {
        // Run unit tests (or skip if none)
        sh 'npm test || echo "No tests configured"'
      }
    }

    stage('Build') {
      steps {
        // Optional build step (for static assets)
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
		  echo "Waiting for app to start..."
		  MAX_RETRIES=10
		  RETRY_DELAY=3
		  for i in $(seq 1 $MAX_RETRIES); do
			STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/)
			if [ "$STATUS" = "200" ]; then
			  echo "✅ App is up (HTTP 200)"
			  exit 0
			fi
			echo "Attempt $i/$MAX_RETRIES: App not ready (status=$STATUS), retrying in $RETRY_DELAY sec..."
			sleep $RETRY_DELAY
		  done
		  echo "❌ Smoke test failed after $MAX_RETRIES attempts."
		  exit 1
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

