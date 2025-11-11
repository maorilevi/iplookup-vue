# CI/CD Setup Guide for GCP App Engine

Complete guide to setting up Continuous Integration and Continuous Deployment with GitHub Actions and Google Cloud Platform App Engine.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [GCP Project Setup](#gcp-project-setup)
3. [Service Account Configuration](#service-account-configuration)
4. [GitHub Secrets Configuration](#github-secrets-configuration)
5. [Workflow Overview](#workflow-overview)
6. [Testing the Pipeline](#testing-the-pipeline)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before starting, ensure you have:

- ✅ GitHub repository with your code
- ✅ Google Cloud Platform account
- ✅ `gcloud` CLI installed locally (optional, for testing)
- ✅ Billing enabled on your GCP project

---

## 🔧 GCP Project Setup

### Step 1: Create a GCP Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **Select a project** → **New Project**
3. Enter project name (e.g., `torq-task-prod`)
4. Note your **Project ID** (you'll need this later)

### Step 2: Enable Required APIs

Run these commands in Cloud Shell or local terminal:

```bash
# Set your project ID
export PROJECT_ID="your-project-id"

# Enable App Engine API
gcloud services enable appengine.googleapis.com --project=$PROJECT_ID

# Enable Cloud Build API
gcloud services enable cloudbuild.googleapis.com --project=$PROJECT_ID

# Enable Cloud Resource Manager API
gcloud services enable cloudresourcemanager.googleapis.com --project=$PROJECT_ID
```

### Step 3: Initialize App Engine

```bash
# Initialize App Engine (choose your region)
gcloud app create --project=$PROJECT_ID --region=us-central

# Note: Choose a region close to your users
# Available regions: us-central, europe-west, asia-northeast1, etc.
```

---

## 🔐 Service Account Configuration

### Step 1: Create Service Account

```bash
# Create service account
gcloud iam service-accounts create github-actions \
    --display-name="GitHub Actions" \
    --project=$PROJECT_ID

# Get the service account email
SA_EMAIL="github-actions@${PROJECT_ID}.iam.gserviceaccount.com"
echo $SA_EMAIL
```

### Step 2: Grant Required Permissions

```bash
# App Engine Admin (for deployments)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/appengine.appAdmin"

# Cloud Build Editor (for building)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/cloudbuild.builds.editor"

# Storage Admin (for storing build artifacts)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/storage.admin"

# Service Account User (to act as service account)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/iam.serviceAccountUser"
```

### Step 3: Create and Download Service Account Key

```bash
# Create key file
gcloud iam service-accounts keys create gcp-key.json \
    --iam-account=$SA_EMAIL \
    --project=$PROJECT_ID

# Display the key content (copy this for GitHub Secrets)
cat gcp-key.json
```

⚠️ **IMPORTANT**: Keep this key secure! Never commit it to your repository.

---

## 🔑 GitHub Secrets Configuration

### Step 1: Navigate to GitHub Repository Settings

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### Step 2: Add Required Secrets

Add the following secrets:

#### `GCP_PROJECT_ID`
- **Value**: Your GCP Project ID (e.g., `torq-task-prod`)
- **Description**: Your Google Cloud Project ID

#### `GCP_SA_KEY`
- **Value**: The entire content of `gcp-key.json` file
- **Description**: Service Account Key JSON
- **Format**: 
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "github-actions@your-project.iam.gserviceaccount.com",
  ...
}
```

### Step 3: Verify Secrets

After adding secrets, you should see:
- ✅ `GCP_PROJECT_ID`
- ✅ `GCP_SA_KEY`

---

## 🔄 Workflow Overview

### CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Actions:**
1. ✅ Checkout code
2. ✅ Setup Node.js (tests on versions 18.x and 20.x)
3. ✅ Install dependencies
4. ✅ Run linting
5. ✅ Run all tests
6. ✅ Build Shell application
7. ✅ Build IP Lookup application
8. ✅ Upload artifacts

**Purpose:** Ensures code quality before deployment.

---

### CD Workflow (`.github/workflows/deploy-gcp.yml`)

**Triggers:**
- Push to `main` branch
- Manual trigger via GitHub Actions UI

**Actions:**
1. ✅ Checkout code
2. ✅ Setup Node.js
3. ✅ Install dependencies
4. ✅ Run tests
5. ✅ Build applications
6. ✅ Authenticate with GCP
7. ✅ Deploy Shell to App Engine (default service)
8. ✅ Deploy IP Lookup to App Engine (ip-lookup service)
9. ✅ Display deployment URLs

**Purpose:** Automatically deploys to production when tests pass.

---

## 🧪 Testing the Pipeline

### Test CI Workflow

1. Create a new branch:
```bash
git checkout -b test-ci
```

2. Make a small change (e.g., update README)

3. Commit and push:
```bash
git add .
git commit -m "test: CI pipeline"
git push origin test-ci
```

4. Create a Pull Request on GitHub

5. Watch the CI workflow run automatically

### Test CD Workflow

1. Merge your PR to `main`:
```bash
git checkout main
git pull origin main
```

2. Push to main:
```bash
git push origin main
```

3. Go to **Actions** tab in GitHub

4. Watch the deployment workflow

5. After completion, visit:
   - Shell: `https://YOUR-PROJECT-ID.appspot.com`
   - IP Lookup: `https://ip-lookup-dot-YOUR-PROJECT-ID.appspot.com`

---

## 📊 Monitoring Deployments

### View Logs in GCP Console

1. Go to [App Engine Console](https://console.cloud.google.com/appengine)
2. Click **Services**
3. Select a service
4. Click **Logs**

### View Deployment History

```bash
# List all versions
gcloud app versions list --project=$PROJECT_ID

# View specific service logs
gcloud app logs read --service=default --project=$PROJECT_ID
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. **Authentication Failed**

**Error:** `Error: google-github-actions/auth failed with: failed to generate Google Cloud access token`

**Solution:**
- Verify `GCP_SA_KEY` secret is correctly formatted JSON
- Ensure service account has required permissions
- Check service account key hasn't expired

#### 2. **App Engine Not Initialized**

**Error:** `The App Engine app does not exist`

**Solution:**
```bash
gcloud app create --project=$PROJECT_ID --region=us-central
```

#### 3. **Permission Denied**

**Error:** `Permission denied` or `403 Forbidden`

**Solution:**
- Re-run the permission grant commands
- Wait a few minutes for IAM changes to propagate

#### 4. **Build Fails**

**Error:** Build step fails during tests or compilation

**Solution:**
- Test locally first: `npm test && npm run build:shell`
- Check Node.js version compatibility
- Review workflow logs in GitHub Actions

#### 5. **Deployment Timeout**

**Error:** Deployment takes too long

**Solution:**
- Increase timeout in `app-shell.yaml` and `app-ip-lookup.yaml`:
```yaml
automatic_scaling:
  min_instances: 1  # Keep at least 1 instance warm
```

---

## 🎯 Best Practices

### 1. **Branch Protection**

Set up branch protection rules:
- Require PR reviews before merging
- Require status checks (CI) to pass
- Prevent direct pushes to `main`

### 2. **Environment Separation**

Consider separate environments:
```yaml
# .github/workflows/deploy-staging.yml
# Deploy to staging environment on develop branch
```

### 3. **Monitoring**

Set up alerts in GCP:
- Error rates
- Response times
- Resource usage

### 4. **Cost Management**

Monitor costs:
- Set budget alerts in GCP
- Use `min_instances: 0` for dev environments
- Review App Engine pricing

### 5. **Security**

- Rotate service account keys regularly
- Use least privilege access
- Enable security scanning in GitHub

---

## 📝 Additional Commands

### Manual Deployment (Local)

```bash
# Build applications
npm run build:shell
npm run build:ip-lookup

# Deploy Shell
gcloud app deploy app-shell.yaml --project=$PROJECT_ID

# Deploy IP Lookup
gcloud app deploy app-ip-lookup.yaml --project=$PROJECT_ID
```

### Rollback Deployment

```bash
# List versions
gcloud app versions list --project=$PROJECT_ID

# Traffic migration to previous version
gcloud app services set-traffic default \
    --splits=VERSION_ID=1 \
    --project=$PROJECT_ID
```

### Delete Old Versions

```bash
# Delete specific version
gcloud app versions delete VERSION_ID \
    --service=default \
    --project=$PROJECT_ID
```

---

## 🎓 Learning Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GCP App Engine Documentation](https://cloud.google.com/appengine/docs)
- [NX Documentation](https://nx.dev)

---

## ✅ Checklist

Before going live, ensure:

- [ ] GCP project created and billing enabled
- [ ] App Engine initialized
- [ ] Service account created with correct permissions
- [ ] GitHub secrets configured
- [ ] CI workflow tested successfully
- [ ] CD workflow tested successfully
- [ ] Both applications accessible via URLs
- [ ] Monitoring and alerts configured
- [ ] Branch protection rules enabled

---

## 🆘 Support

If you encounter issues:

1. Check workflow logs in GitHub Actions
2. Review App Engine logs in GCP Console
3. Verify all secrets are correctly configured
4. Test deployment manually first

---

**🎉 Your CI/CD pipeline is now ready!**

Every push to `main` will automatically:
1. Run all tests ✅
2. Build applications 🏗️
3. Deploy to GCP App Engine 🚀
4. Available at your App Engine URLs 🌐
