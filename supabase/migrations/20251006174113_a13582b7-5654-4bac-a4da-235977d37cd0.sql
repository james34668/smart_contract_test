-- Create enum for transaction types
CREATE TYPE transaction_type AS ENUM ('lend', 'borrow', 'repay', 'withdraw');

-- Create enum for asset types
CREATE TYPE asset_type AS ENUM ('ETH', 'USDC', 'DAI', 'USDT');

-- Create enum for position status
CREATE TYPE position_status AS ENUM ('active', 'closed', 'liquidated');

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create lending positions table
CREATE TABLE public.lending_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  asset asset_type NOT NULL,
  amount DECIMAL(30, 18) NOT NULL CHECK (amount > 0),
  interest_rate DECIMAL(5, 2) NOT NULL,
  status position_status DEFAULT 'active' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create borrowing positions table
CREATE TABLE public.borrowing_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  asset asset_type NOT NULL,
  amount DECIMAL(30, 18) NOT NULL CHECK (amount > 0),
  collateral_amount DECIMAL(30, 18) NOT NULL CHECK (collateral_amount > 0),
  interest_rate DECIMAL(5, 2) NOT NULL,
  health_factor DECIMAL(5, 2) DEFAULT 1.5,
  status position_status DEFAULT 'active' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type transaction_type NOT NULL,
  asset asset_type NOT NULL,
  amount DECIMAL(30, 18) NOT NULL CHECK (amount > 0),
  tx_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create platform metrics table
CREATE TABLE public.platform_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_value_locked DECIMAL(30, 18) DEFAULT 0,
  total_borrowed DECIMAL(30, 18) DEFAULT 0,
  total_supplied DECIMAL(30, 18) DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lending_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.borrowing_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for lending_positions
CREATE POLICY "Users can view their own lending positions"
  ON public.lending_positions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lending positions"
  ON public.lending_positions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lending positions"
  ON public.lending_positions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for borrowing_positions
CREATE POLICY "Users can view their own borrowing positions"
  ON public.borrowing_positions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own borrowing positions"
  ON public.borrowing_positions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own borrowing positions"
  ON public.borrowing_positions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
  ON public.transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for platform_metrics (public read-only)
CREATE POLICY "Anyone can view platform metrics"
  ON public.platform_metrics FOR SELECT
  TO authenticated
  USING (true);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lending_positions_updated_at
  BEFORE UPDATE ON public.lending_positions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_borrowing_positions_updated_at
  BEFORE UPDATE ON public.borrowing_positions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();