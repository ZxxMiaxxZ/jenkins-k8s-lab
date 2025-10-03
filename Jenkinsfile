pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = "demo-app"
        VERSION = "1.0.${BUILD_NUMBER}"
        REGISTRY = "localhost:5000"  // Local registry
    }
    
    stages {
        stage('🏗️ Checkout Code') {
            steps {
                echo "Checking out code..."
                checkout scm
            }
        }
        
        stage('🔨 Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image: ${DOCKER_IMAGE}:${VERSION}"
                    sh """
                        docker build -t ${DOCKER_IMAGE}:${VERSION} .
                        docker tag ${DOCKER_IMAGE}:${VERSION} ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }
        
        stage('🧪 Test Image') {
            steps {
                script {
                    echo "Testing Docker image..."
                    sh """
                        # Run container for testing
                        docker run -d --name test-${BUILD_NUMBER} -p 3001:3000 ${DOCKER_IMAGE}:${VERSION}
                        
                        # Wait for container to start
                        sleep 5
                        
                        # Test health endpoint
                        curl -f http://localhost:3001/health || exit 1
                        
                        # Cleanup test container
                        docker stop test-${BUILD_NUMBER}
                        docker rm test-${BUILD_NUMBER}
                    """
                    echo "✅ Tests passed!"
                }
            }
        }
        
        stage('📤 Load Image to Minikube') {
            steps {
                script {
                    echo "Loading image to Minikube..."
                    sh """
                        # Load image vào Minikube
                        minikube image load ${DOCKER_IMAGE}:${VERSION}
                        minikube image load ${DOCKER_IMAGE}:latest
                        
                        # Verify
                        minikube image ls | grep ${DOCKER_IMAGE}
                    """
                }
            }
        }
        
        stage('🚀 Deploy to Kubernetes') {
            steps {
                script {
                    echo "Deploying to Kubernetes..."
                    sh """
                        # Update placeholders trong deployment.yaml
                        sed -e "s|IMAGE_PLACEHOLDER|${DOCKER_IMAGE}:${VERSION}|g" \
                            -e "s|BUILD_PLACEHOLDER|${BUILD_NUMBER}|g" \
                            -e "s|VERSION_PLACEHOLDER|${VERSION}|g" \
                            k8s/deployment.yaml > k8s/deployment-ready.yaml
                        
                        # Apply to K8s
                        kubectl apply -f k8s/deployment-ready.yaml
                        
                        # Wait for rollout
                        kubectl rollout status deployment/demo-app --timeout=120s
                        
                        # Show deployment info
                        echo "\\n📊 Deployment Status:"
                        kubectl get deployment demo-app
                        kubectl get pods -l app=demo
                        kubectl get svc demo-service
                    """
                }
            }
        }
        
        stage('✅ Verify Deployment') {
            steps {
                script {
                    echo "Verifying deployment..."
                    sh """
                        # Get service URL
                        minikube service demo-service --url > service-url.txt
                        SERVICE_URL=\$(cat service-url.txt)
                        
                        echo "Service URL: \$SERVICE_URL"
                        
                        # Test the service
                        sleep 10
                        curl -f \$SERVICE_URL/health || exit 1
                        
                        echo "\\n✅ Deployment verified successfully!"
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo """
            ========================================
            ✅ PIPELINE SUCCESS!
            ========================================
            Version: ${VERSION}
            Build: ${BUILD_NUMBER}
            
            Access app:
            minikube service demo-service
            
            Or visit:
            http://\$(minikube ip):30100
            ========================================
            """
        }
        failure {
            echo "❌ Pipeline failed!"
        }
        always {
            // Cleanup
            sh """
                rm -f k8s/deployment-ready.yaml service-url.txt || true
            """
        }
    }
}
