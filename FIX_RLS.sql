-- Fix Infinite Recursion in RLS Policies

-- 1. Create a secure function to check board ownership
-- This function is SECURITY DEFINER, so it bypasses RLS on the boards table
CREATE OR REPLACE FUNCTION public.is_board_owner(p_board_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.boards 
    WHERE id = p_board_id AND user_id = p_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the problematic policy
DROP POLICY IF EXISTS "Board owners can manage members" ON public.board_members;

-- 3. Re-create the policy using the secure function
CREATE POLICY "Board owners can manage members"
ON public.board_members FOR ALL
TO authenticated
USING (
    public.is_board_owner(board_id, auth.uid())
)
WITH CHECK (
    public.is_board_owner(board_id, auth.uid())
);
