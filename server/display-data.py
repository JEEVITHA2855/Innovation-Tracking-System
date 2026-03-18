import sqlite3
from datetime import datetime

# Connect to the database
conn = sqlite3.connect("prisma/dev.db")
cursor = conn.cursor()

def print_separator():
    print("\n" + "="*80)

def print_header(title):
    print_separator()
    print(f">>> {title}")
    print("="*80)

# Display Users
print_header("USERS TABLE")
cursor.execute("SELECT * FROM users")
rows = cursor.fetchall()
print(rows)

print_separator()
print(f"Total Users: {len(rows)}")

# Display Ideas
print_header("IDEAS TABLE")
cursor.execute("SELECT * FROM ideas")
rows = cursor.fetchall()
print(rows)

print_separator()
print(f"Total Ideas: {len(rows)}")

# Display Reviews
print_header("REVIEWS TABLE")
cursor.execute("SELECT * FROM reviews")
rows = cursor.fetchall()
print(rows)

print_separator()
print(f"Total Reviews: {len(rows)}")

# Display Notifications
print_header("NOTIFICATIONS TABLE")
cursor.execute("SELECT * FROM notifications")
rows = cursor.fetchall()
print(rows)

print_separator()
print(f"Total Notifications: {len(rows)}")

# Display table column information
print_header("USERS TABLE SCHEMA")
cursor.execute("PRAGMA table_info(users)")
print(cursor.fetchall())

print_header("IDEAS TABLE SCHEMA")
cursor.execute("PRAGMA table_info(ideas)")
print(cursor.fetchall())

print_header("REVIEWS TABLE SCHEMA")
cursor.execute("PRAGMA table_info(reviews)")
print(cursor.fetchall())

print_header("NOTIFICATIONS TABLE SCHEMA")
cursor.execute("PRAGMA table_info(notifications)")
print(cursor.fetchall())

# Summary statistics
print_header("SUMMARY STATISTICS")

cursor.execute("SELECT role, COUNT(*) FROM users GROUP BY role")
print("\nUsers by Role:")
print(cursor.fetchall())

cursor.execute("SELECT status, COUNT(*) FROM ideas GROUP BY status")
print("\nIdeas by Status:")
print(cursor.fetchall())

cursor.execute("SELECT COUNT(*) FROM notifications WHERE is_read = 0")
unread = cursor.fetchone()[0]
print(f"\nUnread Notifications: {unread}")

# Close connection
conn.close()
print_separator()
print("✓ Database query completed successfully!")
print_separator()
