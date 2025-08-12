from app import create_app
import os
from dotenv import load_dotenv
import unittest

load_dotenv()

print("Loading environment variables from .env file...")
# API key is loaded from environment variables (not displayed for security)

def run_tests():
    project_root = os.path.dirname(os.path.abspath(__file__))
    test_dir = os.path.join(project_root, 'testcases')
    
    loader = unittest.TestLoader()
    tests = loader.discover(start_dir=test_dir)
    runner = unittest.TextTestRunner(verbosity=0)
    result = runner.run(tests)
    return result.wasSuccessful()

if __name__ == "__main__":
    if run_tests():
        app = create_app()
        import os
        print("Current working directory:", os.getcwd())
        print("Database URI:", app.config['SQLALCHEMY_DATABASE_URI'])
        app.run(debug=True)
    else:
        print("Unit tests failed. Flask server will not start.")
