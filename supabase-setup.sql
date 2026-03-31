-- Create the client_records table in Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS client_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    pan TEXT,
    assessment_year TEXT,
    tax_regime TEXT,
    income_details JSONB,
    deductions JSONB,
    tax_liability JSONB,
    audit_report JSONB,
    pdf_data TEXT, -- Base64 encoded PDF
    last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_client_records_user_id ON client_records(user_id);
CREATE INDEX IF NOT EXISTS idx_client_records_last_calculated ON client_records(last_calculated DESC);
CREATE INDEX IF NOT EXISTS idx_client_records_pan ON client_records(pan);

-- Enable Row Level Security (RLS)
ALTER TABLE client_records ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Users can only see their own records
CREATE POLICY "Users can view own client records" ON client_records
    FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own records
CREATE POLICY "Users can insert own client records" ON client_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own records
CREATE POLICY "Users can update own client records" ON client_records
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own records
CREATE POLICY "Users can delete own client records" ON client_records
    FOR DELETE USING (auth.uid() = user_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_client_records_updated_at
    BEFORE UPDATE ON client_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();