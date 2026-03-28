CREATE POLICY "Users can delete their own profile"
  ON profiles FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vitals"
  ON health_vitals FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
  ON symptom_conversations FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own vitals"
  ON health_vitals FOR UPDATE USING (auth.uid() = user_id);