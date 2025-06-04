#!/bin/bash

# Deploy the project to Vercel and save the deployment URL
vercel deploy --yes --prod > deployment-url.txt 2> error.txt

# Check the exit code of the deploy command
code=$?
if [ $code -eq 0 ]; then
    # Read the deployment URL from the file
    deploymentUrl=$(cat deployment-url.txt)
    echo "Deployment successful: $deploymentUrl"
    
    # Optionally alias the deployment URL to a custom domain
    # Uncomment and replace 'my-custom-domain.com' with your domain if needed
    # vercel alias $deploymentUrl my-custom-domain.com
else
    # Read the error message from the file
    errorMessage=$(cat error.txt)
    echo "Deployment failed with error: $errorMessage"
    exit 1
fi
