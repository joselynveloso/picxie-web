# GitHub Setup Instructions

## Current Status ✅

Your local Git repository is ready! Here's what's been set up:

- ✅ Git repository initialized
- ✅ `.gitignore` configured (excludes node_modules, .env.local, etc)
- ✅ `.gitmessage` commit template created
- ✅ Git commit template configured
- ✅ GitHub Actions CI/CD workflow created
- ✅ Initial commit made (v0.1.2)

**Latest Commit**: `feat: initial project setup with comprehensive documentation (v0.1.2)`

---

## Next Steps: Connect to GitHub

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the **+** icon in the top-right → **New repository**
3. Repository settings:
   - **Name**: `picxie-web`
   - **Description**: "Construction photo management web application built with Next.js and Supabase"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **Create repository**

### Step 2: Add Remote and Push

After creating the repository on GitHub, run these commands:

```bash
# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/picxie-web.git

# Verify remote was added
git remote -v

# Push to GitHub
git push -u origin main
```

**Example** (if your username is `johndoe`):
```bash
git remote add origin https://github.com/johndoe/picxie-web.git
git push -u origin main
```

### Step 3: Set Up GitHub Secrets (for CI/CD)

For the GitHub Actions workflow to work, you need to add environment variables as secrets:

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

   **Secret 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://ampxyzotiiqmwcwsdfut.supabase.co`

   **Secret 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtcHh5em90aWlxbXdjd3NkZnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NzcwNTEsImV4cCI6MjA3ODA1MzA1MX0.sicapw4FxmgfVWK0GnfJS2KIZKUB8gkVAxHL4yRxtK8`

### Step 4: Create Development Branches (Optional)

For a clean workflow, create development branches:

```bash
# Create and switch to develop branch
git checkout -b develop

# Push develop branch to GitHub
git push -u origin develop

# Create feature branch for data integrity fix
git checkout -b feature/fix-data-integrity

# Push feature branch
git push -u origin feature/fix-data-integrity

# Switch back to main
git checkout main
```

---

## Branch Strategy

### Main Branch (`main`)
- **Purpose**: Production-ready code
- **Protected**: Should require PR reviews
- **CI/CD**: Runs on every push

### Develop Branch (`develop`)
- **Purpose**: Integration branch for features
- **Protected**: Should require PR reviews
- **CI/CD**: Runs on every push

### Feature Branches (`feature/*`)
- **Purpose**: Individual features or fixes
- **Naming**: `feature/description` or `fix/description`
- **Examples**:
  - `feature/add-authentication`
  - `feature/photo-upload`
  - `fix/data-integrity`
  - `docs/update-readme`

### Workflow
1. Create feature branch from `develop`
2. Work on feature
3. Push to GitHub
4. Create Pull Request to `develop`
5. After review & CI passes, merge to `develop`
6. When ready for release, merge `develop` → `main`

---

## GitHub Actions CI/CD

Your repository now has automated checks!

**What runs automatically:**
- ✅ ESLint (code quality)
- ✅ Build verification (ensures app builds)
- 🔄 Tests (commented out until tests are written)

**When it runs:**
- On push to `main` or `develop`
- On pull requests to `main` or `develop`

**View Results:**
- GitHub → Your Repo → **Actions** tab

---

## Commit Message Format

We're using **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no logic change)
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Build/tooling changes

**Examples:**
```
feat(auth): add login page with Supabase Auth
fix(photos): resolve image loading issue
docs(readme): update installation instructions
refactor(dashboard): extract stats calculation
chore(deps): upgrade Next.js to v16.0.2
```

**Pro Tip:** When you run `git commit` (without `-m`), your editor will open with the template from `.gitmessage` to guide you!

---

## Useful Git Commands

```bash
# Check status
git status

# View commit history
git log --oneline -10

# View branches
git branch -a

# Switch branches
git checkout branch-name

# Pull latest changes
git pull origin main

# Push changes
git push origin branch-name

# View remotes
git remote -v

# Undo last commit (keep changes)
git reset --soft HEAD~1

# View commit diff
git show HEAD
```

---

## Next Steps After GitHub Setup

Once connected to GitHub, here are your immediate priorities:

### 1. Enable Branch Protection (Recommended)

On GitHub:
1. Settings → Branches
2. Add rule for `main` branch:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require conversation resolution before merging

### 2. Fix Data Integrity Issue (Priority)

```bash
git checkout -b feature/fix-data-integrity
# Create debug page, fix data, test
git add .
git commit
git push origin feature/fix-data-integrity
# Create PR on GitHub
```

### 3. Set Up Vercel Deployment (Optional)

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Vercel auto-detects Next.js
4. Add environment variables
5. Deploy!

---

## Troubleshooting

### "Remote already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/picxie-web.git
```

### "Permission denied"
You may need to authenticate. Options:
1. Use GitHub CLI: `gh auth login`
2. Use Personal Access Token instead of password
3. Set up SSH keys

### "Failed to push"
```bash
# Pull latest changes first
git pull origin main --rebase
git push origin main
```

---

## Resources

- [GitHub Docs](https://docs.github.com)
- [Conventional Commits](https://www.conventionalcommits.org)
- [Git Branching Strategy](https://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

**You're all set!** 🎉

Just create the repo on GitHub and run the commands from Step 2.
