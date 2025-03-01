const commonStyles = {
  variables: `
        :root {
            --color-bg: #ffffff;
            --color-border: #d0d7de;
            --color-btn-bg: #2da44e;
            --color-btn-edit: #0969da;
            --color-btn-delete:rgb(210, 78, 87);
            --color-btn-hover: #2c974b;
            --color-text: #24292f;
            --color-secondary-bg: #f6f8fa;
            --color-error: #cf222e;
        }
    `,
  base: `
    body {
      font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif;
      margin: 0;
      padding: 20px;
      color: var(--color-text);
      line-height: 1.5;
      background: var(--color-bg);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .container {
      width: 100%;
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 16px;
      box-sizing: border-box;
    }
    @media (max-width: 768px) {
      body {
        padding: 16px;
      }
    }
  `,
  forms: `
    .form {
      border: 1px solid var(--color-border);
      border-radius: 6px;
      padding: 25px;
      width: 100%;
      box-sizing: border-box;
    }
    .form-group {
      margin-bottom: 15px;
      display: flex;
      flex-direction: column;
    }
    label {
      font-weight: 600;
      margin-bottom: 4px;
    }
    input {
      width: 100%;
      padding: 5px 12px;
      font-size: 14px;
      line-height: 28px;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      margin: 4px 0;
      box-sizing: border-box;
    }
  `,
  buttons: `
        .btn {
            padding: 5px 16px;
            border: 1px solid var(--color-border);
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            line-height: 28px;
            cursor: pointer;
            transition: .2s cubic-bezier(0.3, 0, 0.5, 1);
            color: white;
            background: var(--color-btn-bg);
        }
        .btn-edit {
            background: var(--color-btn-edit);
        }
        .btn-delete {
            background: var(--color-btn-delete);
        }
        .btn:hover {
            background: var(--color-btn-hover);
        }
    `,
  links: `
        a {
            color: var(--color-btn-edit);
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    `,
  error: `
        .error {
            color: var(--color-error);
            margin-top: 10px;
            padding: 8px 16px;
            border: 1px solid rgba(207, 34, 46, 0.3);
            border-radius: 6px;
            background-color: rgba(207, 34, 46, 0.1);
        }
    `,
};

export const loginTemplate = `
<!DOCTYPE html>
<html>
<head>
    <title>denoproxy</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/x-icon" href="/static/favicon.ico">
    <style>
        ${commonStyles.variables}
        ${commonStyles.base}
        ${commonStyles.forms}
        ${commonStyles.buttons}
        ${commonStyles.error}

        /* Login specific styles */
        .container {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            max-width: 400px;
            margin: 0 auto;
            padding: 0 16px;
        }
        .form {
            width: 100%;
            margin-top: 24px;
        }
        h2 {
            margin: 0;
            font-size: 24px;
            text-align: center;
        }
        @media (max-width: 768px) {
            .container {
                padding: 0 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>denoproxy dashboard login</h2>
        <form class="form" method="POST" action="/login">
            <div class="form-group">
                <label>Username:</label>
                <input type="text" name="username" required>
            </div>
            <div class="form-group">
                <label>Password:</label>
                <input type="password" name="password" required>
            </div>
            <button type="submit" class="btn">Login</button>
        </form>
    </div>
</body>
</html>
`;

export const homeTemplate = `
<!DOCTYPE html>
<html>
<head>
    <title>denoproxy</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/x-icon" href="/static/favicon.ico">
    <style>
        ${commonStyles.variables}
        ${commonStyles.base}
        ${commonStyles.forms}
        ${commonStyles.buttons}
        ${commonStyles.links}
        ${commonStyles.error}

        /* Home specific styles */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            flex-wrap: wrap;
            gap: 16px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        #addForm {
            margin: 20px 0;
            padding: 24px;
            background: var(--color-secondary-bg);
            border: 1px solid var(--color-border);
            border-radius: 6px;
            box-sizing: border-box;
        }
        .table-wrapper {
            width: 100%;
            overflow-x: auto;
            margin: 20px 0;
            border: 1px solid var(--color-border);
            border-radius: 6px;
        }
        table {
            width: 100%;
            min-width: 650px;
            border-collapse: collapse;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid var(--color-border);
        }
        th {
            background-color: var(--color-secondary-bg);
            font-weight: 600;
            white-space: nowrap;
        }
        .actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        @media (max-width: 768px) {
            .actions {
                flex-direction: column;
                width: 100px;
            }
            .actions button {
                width: 100%;
            }
            th, td {
                padding: 8px;
                font-size: 14px;
            }
        }
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(27, 31, 36, 0.5);
            padding: 16px;
            box-sizing: border-box;
        }
        .modal-content {
            background: var(--color-bg);
            margin: 15% auto;
            padding: 24px;
            width: 100%;
            max-width: 500px;
            border-radius: 6px;
            border: 1px solid var(--color-border);
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>Proxy Routes Management</h1>
            <div class="logout"><a href="/logout">Logout</a></div>
        </header>

        <form id="addForm" action="/routes/add" method="POST">
            <h3>Add New Route</h3>
            <div class="form-group">
                <label>Path prefix:</label>
                <input type="text" name="path" required placeholder="/api">
            </div>
            <div class="form-group">
                <label>Target URL:</label>
                <input type="url" name="target" required placeholder="https://api.example.com">
            </div>
            <button type="submit" class="btn btn-add">Add Route</button>
        </form>

        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Path Prefix</th>
                        <th>Target URL</th>
                        <th>Full Proxy Path</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {{routesRows}}
                </tbody>
            </table>
        </div>
    </div>

    <!-- Edit Modal -->
    <div id="editModal" class="modal">
        <div class="modal-content">
            <h3>Edit Route</h3>
            <form id="editForm" action="/routes/edit" method="POST">
                <input type="hidden" name="originalPath" id="originalPath">
                <div class="form-group">
                    <label>Path prefix:</label>
                    <input type="text" name="path" id="editPath" required>
                </div>
                <div class="form-group">
                    <label>Target URL:</label>
                    <input type="url" name="target" id="editTarget" required>
                </div>
                <button type="submit" class="btn btn-edit">Save Changes</button>
                <button type="button" class="btn" onclick="closeEditModal()">Cancel</button>
            </form>
        </div>
    </div>

    <script>
        function editRoute(path, target) {
            document.getElementById('editModal').style.display = 'block';
            document.getElementById('originalPath').value = path;
            document.getElementById('editPath').value = path;
            document.getElementById('editTarget').value = target;
        }

        function closeEditModal() {
            document.getElementById('editModal').style.display = 'none';
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            if (event.target == document.getElementById('editModal')) {
                closeEditModal();
            }
        }
    </script>
</body>
</html>

`;