import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib

def train_and_save():
    # 1000 users ka synthetic data (Placement ke liye solid hai)
    np.random.seed(42)
    n = 1000
    exp = np.random.randint(0, 11, n)
    projects = np.random.randint(1, 16, n)
    skills = np.random.randint(1, 21, n)
    
    df = pd.DataFrame({'experience': exp, 'projects': projects, 'skills': skills})

    # Logic for target (0:Beginner, 1:Intermediate, 2:Advanced)
    def get_label(r):
        score = (r['experience'] * 4) + (r['projects'] * 2.5) + (r['skills'] * 1.5)
        return 0 if score < 18 else 1 if score < 40 else 2

    df['target'] = df.apply(get_label, axis=1)
    
    # Train Model
    model = RandomForestClassifier(n_estimators=100)
    model.fit(df[['experience', 'projects', 'skills']], df['target'])
    
    joblib.dump(model, 'path_model.pkl')
    print("✅ Model trained and saved as path_model.pkl")

if __name__ == "__main__":
    train_and_save()