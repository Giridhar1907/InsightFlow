import pandas as pd
import sqlite3
import os

# Dictionary to hold dataframes in memory: user_id -> pd.DataFrame
_user_dfs = {}
_active_dataset_ids = {} # user_id -> dataset_id

# Backwards compatibility globals
current_dataframe = None
last_question = None
last_query_plan = None
last_result = None
last_chart = None
last_entity = None

# AI Memory per user
_last_questions = {}
_last_query_plans = {}
_last_results = {}
_last_charts = {}
_last_entities = {}

def get_df(user_id="guest"):
    global current_dataframe
    if user_id in _user_dfs:
        return _user_dfs[user_id]
    
    # Try loading from database
    try:
        conn = sqlite3.connect("storage/insightflow.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, file_path FROM datasets WHERE user_id = ? ORDER BY uploaded_at DESC LIMIT 1", (user_id,))
        row = cursor.fetchone()
        conn.close()
        
        if row and os.path.exists(row['file_path']):
            try:
                df = pd.read_csv(row['file_path'], encoding="latin1")
            except Exception:
                df = pd.read_csv(row['file_path'], encoding="utf-8", on_bad_lines="skip")
            
            _user_dfs[user_id] = df
            _active_dataset_ids[user_id] = row['id']
            current_dataframe = df
            return df
    except Exception as e:
        print("Error autoloading user df:", e)
        
    return current_dataframe

def set_df(df, user_id="guest", dataset_id=None):
    global current_dataframe
    _user_dfs[user_id] = df
    current_dataframe = df
    if dataset_id:
        _active_dataset_ids[user_id] = dataset_id

def get_active_dataset_id(user_id="guest"):
    return _active_dataset_ids.get(user_id)

# AI Memory Getter/Setters with User Isolation & Global Fallback
def get_last_question(user_id="guest"):
    return _last_questions.get(user_id, last_question)

def set_last_question(val, user_id="guest"):
    global last_question
    _last_questions[user_id] = val
    last_question = val

def get_last_query_plan(user_id="guest"):
    return _last_query_plans.get(user_id, last_query_plan)

def set_last_query_plan(val, user_id="guest"):
    global last_query_plan
    _last_query_plans[user_id] = val
    last_query_plan = val

def get_last_result(user_id="guest"):
    return _last_results.get(user_id, last_result)

def set_last_result(val, user_id="guest"):
    global last_result
    _last_results[user_id] = val
    last_result = val

def get_last_chart(user_id="guest"):
    return _last_charts.get(user_id, last_chart)

def set_last_chart(val, user_id="guest"):
    global last_chart
    _last_charts[user_id] = val
    last_chart = val

def get_last_entity(user_id="guest"):
    return _last_entities.get(user_id, last_entity)

def set_last_entity(val, user_id="guest"):
    global last_entity
    _last_entities[user_id] = val
    last_entity = val