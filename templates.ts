const commonStyles = {
  variables: `
        :root {
            --color-bg: #ffffff;
            --color-border: #d0d7de;
            --color-btn-bg: #2da44e;
            --color-btn-edit: #0969da;
            --color-btn-delete: #cf222e;
            --color-btn-hover: #2c974b;
            --color-text: #24292f;
            --color-secondary-bg: #f6f8fa;
            --color-error: #cf222e;
        }
    `,
  base: `
        body {
            font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif;
            margin: 40px auto;
            padding: 20px;
            color: var(--color-text);
            line-height: 1.5;
            background: var(--color-bg);
        }
    `,
  forms: `
        .form {
           border: 1px solid var(--color-border);
           border-radius: 6px;
           padding: 25px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            font-weight: 600;
            display: block;
            margin-bottom: 4px;
        }
        input {
            width: calc(100% - 24px); /* Subtract padding from width */
            padding: 5px 12px;
            font-size: 14px;
            line-height: 28px;
            border: 1px solid var(--color-border);
            border-radius: 6px;
            margin: 4px 0;
            box-sizing: border-box; /* Include padding in width calculation */
        }
    `,
  buttons: `
        .btn {
            padding: 5px 16px;
            border: 1px solid rgba(27, 31, 36, 0.15);
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            line-height: 28px;
            cursor: pointer;
            transition: .2s cubic-bezier(0.3, 0, 0.5, 1);
            color: white;
            background: var(--color-btn-bg);
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
     <link rel="icon" type="image/x-icon" href="/static/favicon.ico">
    <style>
        ${commonStyles.variables}
        ${commonStyles.base}
        ${commonStyles.forms}
        ${commonStyles.buttons}
        ${commonStyles.error}
        body {
            max-width: 500px;
        }
    </style>
</head>
<body>
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
</body>
</html>
`;

export const homeTemplate = `
<!DOCTYPE html>
<html>
<head>
    <title>denoproxy</title>
     <link rel="icon" type="image/x-icon" href="/static/favicon.ico">
    <style>
        ${commonStyles.variables}
        ${commonStyles.base}
        ${commonStyles.forms}
        ${commonStyles.buttons}
        ${commonStyles.links}
        ${commonStyles.error}

        /* Home specific styles */
        body {
            max-width: 1000px;
        }
        .table-wrapper {
            width: 100%;
            overflow-x: auto;
            margin: 20px 0;
            box-shadow: inset -10px 0 10px -10px rgba(0, 0, 0, 0.05);
            border: 1px solid var(--color-border);
            border-radius: 6px;
        }
        table {
            width: 100%;
            min-width: 650px; /* Ensure minimum width for content */
            border-collapse: collapse;
            margin: 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border: none;
            border-bottom: 1px solid var(--color-border);
        }
        tr:last-child td {
            border-bottom: none;
        }
        th {
            background-color: var(--color-secondary-bg);
            font-weight: 600;
            white-space: nowrap;
        }
        td {
            min-width: 120px; /* Minimum column width */
        }
        /* Target URL column can be wider */
        td:nth-child(2) {
            min-width: 200px;
        }
        tr:hover {
            background-color: var(--color-secondary-bg);
        }
        .actions {
            display: flex;
            gap: 8px;
        }
        .btn-add {
            background: var(--color-btn-bg);
        }
        .btn-edit {
            background: var(--color-btn-edit);
        }
        .btn-edit:hover {
            background: #0859C7;
        }
        .btn-delete {
            background: var(--color-btn-delete);
        }
        .btn-delete:hover {
            background: #BF2231;
        }
        .logout {
            float: right;
        }
        #addForm {
            margin: 20px 0;
            padding: 24px;
            background: var(--color-secondary-bg);
            border: 1px solid var(--color-border);
            border-radius: 6px;
            box-sizing: border-box;
        }
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(27, 31, 36, 0.5);
        }
        .modal-content {
            background: var(--color-bg);
            margin: 15% auto;
            padding: 24px;
            width: 80%;
            max-width: 500px;
            border-radius: 6px;
            border: 1px solid var(--color-border);
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    <div class="logout"><a href="/logout">Logout</a></div>
    <h1>Proxy Routes Management</h1>

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

    <!-- Wrap table in a scrollable container -->
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
